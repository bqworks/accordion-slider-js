class LazyLoading {

    // The namespace to be used when adding event listeners
    namespace = 'lazyloading';

    // Reference to the base accordion instance
    accordion;

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        this.accordion.addEventListener( 'update.' + this.namespace, this.checkAndLoadVisibleImages.bind( this ) );

        // Check visible images when a new panel is opened
        this.accordion.addEventListener( 'pageScroll.' + this.namespace, this.checkAndLoadVisibleImages.bind( this ) );
    }

    // Check visible slides and load their images
    checkAndLoadVisibleImages() {
        const firstVisiblePanel = this.accordion.getFirstPanelFromPage(),
            lastVisiblePanel = this.accordion.getLastPanelFromPage(),

            // get all panels that are currently visible
            panelsToCheck = lastVisiblePanel !== this.accordion.getTotalPanels() - 1 ? this.accordion.panels.slice( firstVisiblePanel, lastVisiblePanel + 1 ) : this.accordion.panels.slice( firstVisiblePanel );

        // loop through all the visible panels, verify if there are unloaded images, and load them
        panelsToCheck.forEach( ( panel ) => {
            const panelEl = panel.panelEl;
            
            if ( panelEl.getAttribute( 'data-loaded' ) === null ) {
                panelEl.setAttribute( 'data-loaded', true );

                Array.from( panelEl.getElementsByTagName( 'img' ) ).forEach( ( imageEl ) => {
                    this.loadImage( imageEl );
                });
            }
        });
    }

    // Load an image
    loadImage( imageEl, callback = null ) {
        // Create a new image element
        const newImageEl = new Image();

        // Copy the class(es) and inline style
        newImageEl.setAttribute( 'class', imageEl.getAttribute( 'class' ) );
        newImageEl.setAttribute( 'style', imageEl.getAttribute( 'style' ) );

        // Copy the data attributes
        for ( let keyname in imageEl.dataset ) {
            newImageEl.setAttribute( 'data-' + keyname, imageEl.dataset[ keyname ] );
        }

        // Copy the width and height attributes if they exist
        if ( imageEl.getAttribute( 'width' ) !== null ) {
            newImageEl.setAttribute( 'width', imageEl.getAttribute( 'width' ) );
        }

        if ( imageEl.getAttribute( 'height' ) !== null ) {
            newImageEl.setAttribute( 'height', imageEl.getAttribute( 'height' ) );
        }

        if ( imageEl.getAttribute( 'alt' ) !== null ) {
            newImageEl.setAttribute( 'alt', imageEl.getAttribute( 'alt' ) );
        }

        if ( imageEl.getAttribute( 'title' ) !== null ) {
            newImageEl.setAttribute( 'title', imageEl.getAttribute( 'title' ) );
        }

        // Assign the source of the image
       
        if ( imageEl.getAttribute( 'data-src' ) !== null ) {
            newImageEl.setAttribute( 'src', imageEl.getAttribute( 'data-src' ) );
            newImageEl.removeAttribute( 'data-src' );
        } else {
            newImageEl.setAttribute( 'src', imageEl.getAttribute( 'src' ) );
        }
        
        if ( imageEl.getAttribute( 'data-srcset' ) !== null ) {
            newImageEl.setAttribute( 'srcset', imageEl.getAttribute( 'data-srcset' ) );
            newImageEl.removeAttribute( 'data-srcset' );
        }

        // Add the new image in the same container and remove the older image
        imageEl.after( newImageEl );
        imageEl.remove();
        imageEl = null;
		
        if ( typeof callback === 'function' ) {
            callback( newImageEl );
        }
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );
    }
}

export default LazyLoading;