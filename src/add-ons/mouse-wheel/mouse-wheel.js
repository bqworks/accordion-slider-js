class MouseWheel {

    // The namespace to be used when adding event listeners
    namespace = 'mousewheel';

    // Reference to the base accordion instance
    accordion;

    // Stores the current settings of the accordion
    settings;

    // Indicates whether the mouse wheel navigation is enabled
    isEnabled = false;

    allowMouseWheelScroll = true;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {

        // Indicates whether mouse wheel navigation will be enabled
        mouseWheel: true,

        mouseWheelDirection: 'normal',
		
        mouseWheelSensitivity: 10,
		
        mouseWheelTarget: 'panel'
    };

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        this.accordion.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
    }

    updateHandler() {
        this.settings = { ...this.defaults, ...this.accordion.settings };

        if ( this.settings.mouseWheel === true && this.isEnabled === false ) {
            this.isEnabled = true;
            this.enable();
        }

        if ( this.settings.mouseWheel === false && this.isEnabled === true ) {
            this.isEnabled = false;
            this.disable();
        }
    }

    enable() {
        this.accordion.accordionEl.addEventListener( 'wheel', this.eventHandlerReferences[ 'wheel' ] = ( event ) => {
            event.preventDefault();

            let delta = event.deltaY * ( this.settings.mouseWheelDirection === 'normal' ? 1 : -1 );

            if ( this.allowMouseWheelScroll === true && Math.abs( delta ) >= this.settings.mouseWheelSensitivity ) {
                this.allowMouseWheelScroll = false;

                setTimeout(() => {
                    this.allowMouseWheelScroll = true;
                }, 500 );

                if ( delta >= this.settings.mouseWheelSensitivity ) {
                    if ( this.settings.mouseWheelTarget === 'page' ) {
                        this.accordion.nextPage();
                    } else {
                        this.accordion.nextPanel();
                    }
                } else if ( delta <= - this.settings.mouseWheelSensitivity ) {
                    if ( this.settings.mouseWheelTarget === 'page' ) {
                        this.accordion.previousPage();
                    } else {
                        this.accordion.previousPanel();
                    }
                }
            }
        });
    }

    disable() {
        this.accordion.accordionEl.removeEventListener( 'wheel', this.eventHandlerReferences[ 'wheel' ] );
    }

    // Destroy the module
    destroy() {
        this.accordion.removeEventListener( 'update.' + this.namespace );
        this.disable();
    }
}

export default MouseWheel;