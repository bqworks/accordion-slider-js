class Buttons {

    // The namespace to be used when adding event listeners
    namespace = 'buttons';

    // Reference to the base accordion instance
    accordion;

    // Stores the current settings of the accordion
    settings;

    // Reference to the buttons container
    buttonsEl = null;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {
		
        // Indicates whether the buttons will be created
        buttons: true
    };

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        this.accordion.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );

        // Select the corresponding button when the page changes
        this.accordion.addEventListener( 'pageScroll.' + this.namespace, ( event ) => {
            if ( typeof this.buttonsEl === 'undefined' ) {
                return;
            }

            this.buttonsEl.getElementsByClassName( 'as-selected' )[0].classList.remove( 'as-selected' );
            this.buttonsEl.getElementsByClassName( 'as-pagination-button' )[ event.detail.index ].classList.add( 'as-selected' );
        });
    }

    updateHandler() {
        this.settings = { ...this.defaults, ...this.accordion.settings };

        this.buttonsEl = this.accordion.accordionEl.getElementsByClassName( 'as-pagination-buttons' )[0];

        const totalPages = this.accordion.getTotalPages();

        // If there is more that one page but the buttons weren't created yet, create the buttons.
        // If the buttons were created but their number differs from the total number of pages, re-create the buttons.
        // If the buttons were created but there are less than one page, remove the buttons.
        if ( this.settings.buttons === true && totalPages > 1 && typeof this.buttonsEl === 'undefined' ) {
            this.createButtons();
        } else if ( this.settings.buttons === true && typeof this.buttonsEl !== 'undefined' && totalPages !== this.buttonsEl.getElementsByClassName( 'as-pagination-button' ).length ) {
            this.adjustButtons();
        } else if ( ( this.settings.buttons === false && typeof this.buttonsEl !== 'undefined' ) || ( totalPages <= 1 && typeof this.buttonsEl !== 'undefined' ) ) {
            this.removeButtons();
        }
    }

    // Create the buttons
    createButtons() {
        // Create the buttons' container
        this.buttonsEl = document.createElement( 'div' );
        this.buttonsEl.classList.add( 'as-pagination-buttons' );
        this.accordion.accordionEl.appendChild( this.buttonsEl );

        // Create the buttons
        for ( let i = 0; i < this.accordion.getTotalPages(); i++ ) {
            const buttonEl = document.createElement( 'div' );
            buttonEl.classList.add( 'as-pagination-button' );
            this.buttonsEl.appendChild( buttonEl );

            if ( i === this.accordion.getCurrentPage() ) {
                buttonEl.classList.add( 'as-selected' );
            }

            const buttonClickHandler = () => {
                this.accordion.gotoPage( i );
            };

            this.eventHandlerReferences[ 'click.button' + i ] = buttonClickHandler;

            buttonEl.addEventListener( 'click', buttonClickHandler );
        }

        // Indicate that the accordion has buttons 
        this.accordion.accordionEl.classList.add( 'as-has-buttons' );
    }

    // Re-create the buttons. This is called when the number of panel pages changes.
    adjustButtons() {
        this.removeButtons();
        this.createButtons();
    }

    // Remove the buttons
    removeButtons() {
        Array.from( this.buttonsEl.getElementsByClassName( 'as-pagination-button' ) ).forEach( ( buttonEl, index ) => {
            const buttonClickHandler = this.eventHandlerReferences[ 'click.button' + index ];
			
            buttonEl.removeEventListener( 'click', buttonClickHandler );
        });
		
        this.buttonsEl.remove();
        this.accordion.accordionEl.classList.remove( 'as-has-buttons' );
    }

    destroy() {
        this.accordion.removeEventListener( 'pageScroll.' + this.namespace );
        this.accordion.removeEventListener( 'update.' + this.namespace );
        this.removeButtons();
    }
}

export default Buttons;