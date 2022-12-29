class DeepLinking {

    // The namespace to be used when adding event listeners
    namespace = 'deeplinking';

    // Reference to the base accordion instance
    accordion;

    // Stores the current settings of the accordion
    settings;

    // Default add-on settings
    defaults = {

        // Indicates whether the hash will be updated when a new panel is opened
        updateHash: false
    };

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        this.settings = { ...this.defaults, ...this.accordion.settings };

        // Parse the initial hash
        this.accordion.addEventListener( 'init.' + this.namespace, () => {
            this.gotoHash( window.location.hash );
        });

        // Update the hash when a new panel is opened
        this.accordion.addEventListener( 'panelOpen.' + this.namespace, ( event ) => {
            if ( this.settings.updateHash === true ) {

                // get the 'id' attribute of the panel
                let panelId = this.accordion.accordionEl.getElementsByClassName( 'as-panel' )[ event.detail.index ].getAttribute( 'id' );

                // if the panel doesn't have an 'id' attribute, use the panel index
                if ( panelId === null ) {
                    panelId = event.detail.index;
                }

                window.location.hash = this.accordion.accordionEl.getAttribute( 'id' ) + '/' + panelId;
            }
        });

        // Check when the hash changes and navigate to the indicated panel
        window.addEventListener( 'hashchange', this.eventHandlerReferences[ 'hashchange' ] = () => {
            this.gotoHash( window.location.hash );
        });
    }

    // Parse the hash and return the accordion id and the panel id
    parseHash( hash ) {
        if ( hash !== '' ) {
            // Eliminate the # symbol
            hash = hash.substring(1);

            // Get the specified accordion id and panel id
            const values = hash.split( '/' ),
                panelId = values.pop(),
                accordionId = hash.slice( 0, - panelId.toString().length - 1 );

            if ( this.accordion.accordionEl.getAttribute( 'id' ) === accordionId ) {
                return {
                    accordionId,
                    panelId
                };
            }
        }

        return false;
    }

    // Navigate to the appropriate panel, based on the specified hash
    gotoHash( hash ) {
        const parsedHash = this.parseHash( hash );
		
        if ( parsedHash === false ) {
            return;
        }

        const { panelId } = parsedHash;

        const panelIdNumber = parseInt( panelId, 10 );

        // check if the specified panel id is a number or string
        if ( isNaN( panelIdNumber ) ) {
            // get the index of the panel based on the specified id
            const panelEl = document.getElementById( panelId );
            const panelIndex = Array.from( this.accordion.accordionEl.getElementsByClassName( 'as-panel') ).indexOf( panelEl );

            if ( panelIndex !== -1 && panelIndex !== this.accordion.getCurrentIndex() ) {
                this.accordion.openPanel( panelIndex );
            }
        } else if ( panelIdNumber !== this.accordion.getCurrentIndex() ) {
            this.accordion.openPanel( panelIdNumber );
        }
    }

    // Destroy the module
    destroy() {
        this.accordion.removeEventListener( 'init.' + this.namespace );
        this.accordion.removeEventListener( 'panelOpen.' + this.namespace );

        window.removeEventListener( 'hashchange', this.eventHandlerReferences[ 'hashchange' ] );
    }
}

export default DeepLinking;