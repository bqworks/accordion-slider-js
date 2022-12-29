import VideoController from './video-controller.js';

class Video {

    // The namespace to be used when adding event listeners
    namespace = 'video';

    // Reference to the base accordion instance
    accordion = null;

    // Stores the current settings of the accordion
    settings = null;

    videoReferences = {};

    preinitVideoClickHandler = null;

    // Default add-on settings
    defaults = {

        // Sets the action that the video will perform when its panel container is opened
        // ( 'playVideo' and 'none' )
        openPanelVideoAction: 'none',

        // Sets the action that the video will perform when another panel is opened
        // ( 'stopVideo', 'pauseVideo', 'removeVideo' and 'none' )
        closePanelVideoAction: 'pauseVideo',

        // Sets the action that the accordion will perform when the video starts playing
        // ( 'stopAutoplay' and 'none' )
        playVideoAction: 'stopAutoplay',

        // Sets the action that the accordion will perform when the video is paused
        // ( 'startAutoplay' and 'none' )
        pauseVideoAction: 'none',

        // Sets the action that the accordion will perform when the video ends
        // ( 'startAutoplay', 'nextPanel', 'replayVideo' and 'none' )
        endVideoAction: 'none'
    };

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        this.accordion.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
        this.accordion.addEventListener( 'panelOpen.' + this.namespace, this.panelOpenHandler.bind( this ) );
        this.accordion.addEventListener( 'panelOpenComplete.' + this.namespace, this.panelOpenCompleteHandler.bind( this ) );
        //this.accordion.addEventListener( 'panelsClose.' + this.namespace, this.panelOpenHandler.bind( this ) );
    }

    updateHandler() {
        this.settings = { ...this.defaults, ...this.accordion.settings };

        // Find all the inline videos and initialize them
        Array.from( this.accordion.accordionEl.querySelectorAll( '.as-video:not(a):not([data-video-init])' ) ).forEach(( videoEl ) => {
            this.initVideo( videoEl );
        });

        // Find all the lazy-loaded videos and pre-initialize them. They will be initialized
        // only when their play button is clicked.
        Array.from( this.accordion.accordionEl.querySelectorAll( 'a.as-video:not([data-video-preinit])' ) ).forEach(( videoEl ) => {
            this.preinitVideo( videoEl );
        });
    }

    // Initialize the target video
    initVideo( videoEl ) {
        videoEl.setAttribute( 'data-video-init', true );

        const video = new VideoController( videoEl );
        const videoReference = ( parseInt( new Date().valueOf(), 10 ) * Math.floor( Math.random() * 1000 ) ).toString();

        videoEl.setAttribute( 'data-video-ref', videoReference );
        this.videoReferences[ videoReference ] = video;

        // When the video starts playing, pause the autoplay if it's running
        video.addEventListener( 'videoPlay', () => {
            if ( this.settings.playVideoAction === 'stopAutoplay' && typeof this.accordion.addOns[ 'Autoplay' ] !== 'undefined' ) {
                this.accordion.addOns[ 'Autoplay' ].stop();
                this.settings.autoplay = false;
                this.accordion.addOns[ 'Autoplay' ].settings.autoplay = false;
            }
        });

        // When the video is paused, restart the autoplay
        video.addEventListener( 'videoPause', () => {
            if ( this.settings.pauseVideoAction === 'startAutoplay' && typeof this.accordion.addOns[ 'Autoplay' ] !== 'undefined' ) {
                this.settings.autoplay = true;
                this.accordion.addOns[ 'Autoplay' ].settings.autoplay = true;
                this.accordion.addOns[ 'Autoplay' ].stop();
                this.accordion.addOns[ 'Autoplay' ].start();
            }
        });

        // When the video ends, restart the autoplay (which was paused during the playback), or
        // go to the next panel, or replay the video
        video.addEventListener( 'videoEnded', () => {
            if ( this.settings.endVideoAction === 'startAutoplay' && typeof this.accordion.addOns[ 'Autoplay' ] !== 'undefined' ) {
                this.settings.autoplay = true;
                this.accordion.addOns[ 'Autoplay' ].settings.autoplay = true;
                this.accordion.addOns[ 'Autoplay' ].stop();
                this.accordion.addOns[ 'Autoplay' ].start();
            } else if ( this.settings.endVideoAction === 'nextPanel' ) {
                this.accordion.nextPanel();
            } else if ( this.settings.endVideoAction === 'replayVideo' ) {
                video.replay();
            }
        });
    }

    // Pre-initialize the video. This is for lazy loaded videos.
    preinitVideo( videoEl ) {
        videoEl.setAttribute( 'data-video-preinit', true );

        // When the video poster is clicked, remove the poster and create
        // the inline video
        this.preinitVideoClickHandler = ( event ) => {
            let videoEl = event.target;

            // If the video is being dragged, don't start the video
            if ( this.accordion.accordionEl.classList.contains( 'as-swiping' ) || 
                videoEl.parentElement.querySelector( '.as-video[data-video-init]' ) !== null ) {
                return;
            }

            event.preventDefault();

            let href = videoEl.getAttribute( 'href' ),
                iframe,
                provider,
                regExp,
                match,
                id,
                src,
                videoAttributes,
                videoPoster = videoEl.getElementsByTagName( 'img' )[0],
                videoWidth = videoPoster.getAttribute( 'width' ) || videoPoster.clientWidth,
                videoHeight = videoPoster.getAttribute( 'height') || videoPoster.clientHeight;

            // Check if it's a youtube or vimeo video
            if ( href.indexOf( 'youtube' ) !== -1 || href.indexOf( 'youtu.be' ) !== -1 ) {
                provider = 'youtube';
            } else if ( href.indexOf( 'vimeo' ) !== -1 ) {
                provider = 'vimeo';
            }

            // Get the id of the video
            regExp = provider === 'youtube' ? /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/ : /(www\.)?vimeo.com\/(\d+)/;
            match = href.match( regExp );
            id = match[2];

            // Get the source of the iframe that will be created
            src = provider === 'youtube' ? '//www.youtube.com/embed/' + id + '?enablejsapi=1&wmode=opaque' : '//player.vimeo.com/video/'+ id;
            
            // Get the attributes passed to the video link and then pass them to the iframe's src
            videoAttributes = href.split( '?' )[ 1 ];

            if ( typeof videoAttributes !== 'undefined' ) {
                videoAttributes = videoAttributes.split( '&' );

                videoAttributes.forEach( ( value ) => {
                    if ( value.indexOf( id ) === -1 ) {
                        src += '&' + value;
                    }
                });
            }

            // Create the iframe
            iframe = document.createElement( 'iframe' );
            iframe.setAttribute( 'src', src );
            iframe.setAttribute( 'width', videoWidth );
            iframe.setAttribute( 'height', videoHeight );
            iframe.setAttribute( 'class', videoEl.getAttribute( 'class' ) );
            iframe.setAttribute( 'frameborder', 0 );
            iframe.setAttribute( 'allowfullscreen', 'allowfullscreen' );
            videoEl.parentElement.insertBefore( iframe, videoEl );

            // Initialize the video and play it
            this.initVideo( iframe );

            const player = this.videoReferences[ iframe.getAttribute( 'data-video-ref' ) ];
            player.play();

            // Hide the video poster
            videoEl.style.display = 'none';
        };

        videoEl.addEventListener( 'click', this.preinitVideoClickHandler );
    }

    // Called when a new panel is opened
    panelOpenHandler( event ) {
        if ( event.detail.previousIndex === -1 ) {
            return;
        }

        // Get the video from the previous panel
        const previousVideoEl = this.accordion.panelsContainerEl.getElementsByClassName( 'as-panel' )[ event.detail.previousIndex ].querySelector( '.as-video[data-video-init]' );
		
        if ( previousVideoEl === null ) {
            return;
        }

        const previousVideo = this.videoReferences[ previousVideoEl.getAttribute( 'data-video-ref' ) ];
        
        // Handle the video from the previous panel by stopping it, or pausing it,
        // or remove it, depending on the value of the 'closePanelVideoAction' option.
        if ( previousVideo !== null ) {
            if ( this.settings.closePanelVideoAction === 'stopVideo' ) {
                previousVideo.stop();
            } else if ( this.settings.closePanelVideoAction === 'pauseVideo' ) {
                previousVideo.pause();
            } else if ( this.settings.closePanelVideoAction === 'removeVideo' ) {
                // If the video was lazy-loaded, remove it and show the poster again. If the video
                // was not lazy-loaded, but inline, stop the video.
                if ( previousVideoEl.parentElement.querySelector( 'a.as-video' ) !== null ) {

                    previousVideoEl.parentElement.querySelector( 'a.as-video' ).style.removeProperty( 'display' );
                    previousVideo.destroy();
                    previousVideoEl.remove();
                } else {
                    previousVideo.stop();
                }
            }
        }
    }

    // Called when a new panel is opened, 
    // after the transition animation is complete.
    panelOpenCompleteHandler( event ) {

        // Handle the video from the opened panel
        if ( this.settings.openPanelVideoAction === 'playVideo' && event.detail.index === this.accordion.getCurrentIndex() ) {
            const loadedVideoEl = this.accordion.panelsContainerEl.getElementsByClassName( 'as-panel' )[ event.detail.index ].querySelector( '.as-video[data-video-init]' ),
                unloadedVideoEl = this.accordion.panelsContainerEl.getElementsByClassName( 'as-panel' )[ event.detail.index ].querySelector( '.as-video[data-video-preinit]' );

            // If the video was already initialized, play it. If it's not initialized (because
            // it's lazy loaded) initialize it and play it.
            if ( loadedVideoEl !== null ) {
                const loadedVideo = this.videoReferences[ loadedVideo.getAttribute( 'data-video-ref' ) ];
                loadedVideo.play();
            } else if ( unloadedVideoEl !== null ) {
                unloadedVideoEl.dispatchEvent( 'click' );
            }

            // Autoplay is stopped when the video starts playing
            // and the video's 'play' event is fired, but on slower connections,
            // the video's playing will be delayed and the 'play' event
            // will not fire in time to stop the autoplay, so we'll
            // stop it here as well.
            if ( this.settings.playVideoAction === 'stopAutoplay' && typeof this.accordion.addOns[ 'Autoplay' ] !== 'undefined' ) {
                this.accordion.addOns[ 'Autoplay' ].stop();
                this.settings.autoplay = false;
                this.accordion.addOns[ 'Autoplay' ].settings.autoplay = false;
            }
        }
    }

    // Destroy the module
    destroy() {
        Array.from( this.accordion.accordionEl.querySelectorAll( '.as-video[ data-video-preinit ]' ) ).forEach( ( videoEl ) => {
            videoEl.removeAttribute( 'data-video-preinit' );
            videoEl.removeEventListener( 'click', this.preinitVideoClickHandler );
        });

        // Loop through all the videos and destroy them
        Array.from( this.accordion.accordionEl.querySelectorAll( '.as-video[ data-video-init ]' ) ).forEach( ( videoEl ) => {
            videoEl.removeAttribute( 'data-video-init' );
			
            const video = this.videoReferences[ videoEl.getAttribute( 'data-video-ref' ) ];
            video.removeEventListener( 'videoPlay' );
            video.removeEventListener( 'videoPause' );
            video.removeEventListener( 'videoEnded' );
            video.destroy();

            videoEl.removeAttribute( 'data-video-ref' );

            if ( videoEl.parentElement.querySelector( '.as-video[ data-video-preinit ]' ) !== null ) {
                videoEl.remove();
            }
        });

        this.videoReferences.length = 0;

        this.accordion.removeEventListener( 'update.' + this.namespace );
        this.accordion.removeEventListener( 'panelOpen.' + this.namespace );
        this.accordion.removeEventListener( 'panelOpenComplete.' + this.namespace );
    }
}

export default Video;
