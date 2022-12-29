class Retina {

    // The namespace to be used when adding event listeners
    namespace = 'retina';

    // Reference to the base accordion instance
    accordion;

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        // Return if it's not a retina screen
        if ( window.devicePixelRatio < 2 ) {
            return;
        }
		
        this.accordion.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
    }

    // Loop through the panels and replace the images with their retina version
    updateHandler() {
        this.accordion.panels.forEach( ( panel ) => {
            const panelEl = panel.panelEl;
			
            if ( panelEl.getAttribute( 'data-retina-loaded' ) === null ) {
                panelEl.setAttribute( 'data-retina-loaded', true );
                
                Array.from( panelEl.querySelectorAll( 'img[data-retina]' ) ).forEach( ( imageEl ) => {
                    if ( imageEl.getAttribute( 'data-src' ) !== null ) {
                        imageEl.setAttribute( 'data-src', imageEl.getAttribute( 'data-retina' ) );
                        imageEl.removeAttribute( 'data-retina' );
                    } else {
                        this.loadImage( imageEl );
                    }
                });
            }
        });
    }

    // Load the retina image
    loadImage( imageEl, callback = null ) {
        let retinaFound = false,
            newImagePath = '';

        // Check if there is a retina image specified
        if ( imageEl.getAttribute( 'data-retina' ) !== null ) {
            retinaFound = true;

            newImagePath = imageEl.getAttribute( 'data-retina' );
        }

        // Check if there is a lazy loaded, non-retina, image specified
        if ( imageEl.getAttribute( 'data-src' ) !== null ) {
            if ( retinaFound === false ) {
                newImagePath = imageEl.getAttribute( 'data-src') ;
            }

            imageEl.removeAttribute( 'data-src' );
        }

        // Return if there isn't a retina or lazy loaded image
        if ( newImagePath === '' ) {
            return;
        }

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

        if ( imageEl.getAttribute( 'data-srcset' ) !== null ) {
            newImageEl.setAttribute( 'srcset', imageEl.getAttribute( 'data-srcset' ) );
            newImageEl.removeAttribute( 'data-srcset' );
        }

        // Add the new image in the same container and remove the older image
        imageEl.after( newImageEl );
        imageEl.remove();
        imageEl = null;

        // Assign the source of the image
        newImageEl.setAttribute( 'src', newImagePath );

        if ( typeof callback === 'function' ) {
            callback( newImageEl );
        }
    }

    // Destroy the module
    destroy() {
        this.accordion.removeEventListener( 'update.' + this.namespace );
    }
}

export default Retina;