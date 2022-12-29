class Autoplay {

    // The namespace to be used when adding event listeners
    namespace = 'autoplay';

    // Reference to the base accordion instance
    accordion;

    // Stores the current settings of the accordion
    settings;

    // Reference to the setTimeout timer
    autoplayTimer;

    // Stopped, paused, running
    autoplayState = 'stopped';

    autoplayIndex = -1;

    // Indicates whether the accordion is hovered or not
    isHover = false;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {
        autoplay: true,
        autoplayDelay: 5000,
        autoplayDirection: 'normal', // Possible values are 'normal' and 'backwards'.
        autoplayOnHover: 'pause' // Possible values are 'pause', 'stop' or 'none'.
    };

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        this.accordion.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
    }

    // Start the autoplay if it's enabled, or stop it if it's disabled but running 
    updateHandler() {
        this.settings = { ...this.defaults, ...this.accordion.settings };

        if ( this.settings.autoplay === true && this.autoplayState === 'stopped' ) {
            this.accordion.addEventListener( 'panelOpen.' + this.namespace, () => {
                this.panelOpenHandler();
            });

            this.accordion.addEventListener( 'panelOpenComplete.' + this.namespace, () => {
                this.panelOpenCompleteHandler();
            });

            // store the index of the previously opened panel
            this.accordion.addEventListener( 'panelsClose.' + this.namespace, ( event ) => {
                if ( event.detail.previousIndex !== -1 ) {
                    this.autoplayIndex = event.detail.previousIndex;
                }
            });

            // store the index of the first panel from the new page
            this.accordion.addEventListener( 'pageScroll.' + this.namespace, () => {
                this.autoplayIndex = this.accordion.getFirstPanelFromPage() - 1;
            });

            this.accordion.accordionEl.addEventListener( 'mouseenter', this.eventHandlerReferences[ 'mouseenter' ] = () => {
                this.mouseEnterHandler();
            });

            this.accordion.accordionEl.addEventListener( 'mouseleave', this.eventHandlerReferences[ 'mouseleave' ] = () => {
                this.mouseLeaveHandler();
            });

            this.autoplayState = 'running';
            this.start();
        } else if ( this.settings.autoplay === true && this.autoplayState === 'running' ) {
            this.accordion.removeEventListener( 'panelOpen.' + this.namespace );
            this.accordion.removeEventListener( 'panelOpenComplete.' + this.namespace );
            this.accordion.removeEventListener( 'mouseenter.' + this.namespace );
            this.accordion.removeEventListener( 'mouseleave.' + this.namespace );

            this.autoplayState = 'stopped';
            this.stop();
        }
    }

    // Restart the autoplay timer when a new panel is opened
    panelOpenHandler() {
        // stop previous timers before starting a new one
        if ( this.autoplayState === 'running' ) {
            this.stop();
            this.autoplayState = 'paused';
        }
    }

    panelOpenCompleteHandler() {
        if ( this.isHover === true && ( this.settings.autoplayOnHover === 'pause' || this.settings.autoplayOnHover === 'stop' ) ) {
            return;
        }

        if ( this.autoplayState === 'paused' ) {
            this.start();
            this.autoplayState = 'running';
        }
    }

    // Pause the autoplay when the accordion is hovered
    mouseEnterHandler() {
        this.isHover = true;

        if ( this.autoplayState === 'running' && ( this.settings.autoplayOnHover === 'pause' || this.settings.autoplayOnHover === 'stop' ) ) {
            this.stop();
            this.autoplayState = 'paused';
        }
    }

    // Start the autoplay when the mouse moves away from the accordion
    mouseLeaveHandler() {
        this.isHover = false;

        if ( this.settings.autoplay === true && this.autoplayState === 'paused' && this.settings.autoplayOnHover !== 'stop' ) {
            this.start();
            this.autoplayState = 'running';
        }
    }

    // Starts the autoplay
    start() {
        this.autoplayTimer = setTimeout(() => {
            // check if there is a stored index from which the autoplay needs to continue
            if ( this.autoplayIndex !== -1 )	{
                this.accordion.currentIndex = this.autoplayIndex;
                this.autoplayIndex = -1;
            }

            if ( this.settings.autoplayDirection === 'normal' ) {
                this.accordion.nextPanel();
            } else if ( this.settings.autoplayDirection === 'backwards' ) {
                this.accordion.previousPanel();
            }
        }, this.settings.autoplayDelay );
    }

    // Stops the autoplay
    stop() {
        clearTimeout( this.autoplayTimer );
    }

    // Destroy the module
    destroy() {
        clearTimeout( this.autoplayTimer );

        this.accordion.removeEventListener( 'update.' + this.namespace );
        this.accordion.removeEventListener( 'panelOpen.' + this.namespace );
        this.accordion.removeEventListener( 'panelOpenComplete.' + this.namespace );
        this.accordion.removeEventListener( 'panelsClose.' + this.namespace );
        this.accordion.removeEventListener( 'pageScroll.' + this.namespace );

        this.accordion.accordionEl.removeEventListener( 'mouseenter', this.eventHandlerReferences[ 'mouseenter' ] );
        this.accordion.accordionEl.removeEventListener( 'mouseleave', this.eventHandlerReferences[ 'mouseleave' ] );
    }
}

export default Autoplay;