class Keyboard {

    // The namespace to be used when adding event listeners
    namespace = 'keyboards';

    // Reference to the base accordion instance
    accordion;

    // Stores the current settings of the accordion
    settings;

    // Indicates whether the keyboard navigation is enabled
    isEnabled = false;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {

        // Indicates whether keyboard navigation will be enabled
        keyboard: true,

        // Indicates whether the accordion will respond to keyboard input only when
        // the accordion is in focus.
        keyboardOnlyOnFocus: false,

        keyboardTarget: 'panel'
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

        if ( this.settings.keyboard === true && this.isEnabled === false ) {
            this.isEnabled = true;
            this.enable();
        }

        if ( this.settings.keyboard === false && this.isEnabled === true ) {
            this.isEnabled = false;
            this.disable();
        }
    }

    enable() {
        let hasFocus = false;

        // Detect when the panel is in focus and when it's not, and, optionally, make it
        // responsive to keyboard input only when it's in focus
        this.accordion.accordionEl.addEventListener( 'focus', this.eventHandlerReferences['focus'] = () => {
            hasFocus = true;
        });

        this.accordion.accordionEl.addEventListener( 'blur', this.eventHandlerReferences['blur'] = () => {
            hasFocus = false;
        });

        const keydownHandler = ( event ) => {
            if ( this.settings.keyboardOnlyOnFocus === true && hasFocus === false ) {
                return;
            }

            // If the left arrow key is pressed, go to the previous panel.
            // If the right arrow key is pressed, go to the next panel.
            // If the Enter key is pressed, open the link attached to the main panel image.
            if ( event.which === 37 ) {
                if ( this.settings.keyboardTarget === 'panel' ) {
                    this.accordion.previousPanel();
                } else {
                    this.accordion.previousPage();
                }
            } else if ( event.which === 39 ) {
                if ( this.settings.keyboardTarget === 'panel' ) {
                    this.accordion.nextPanel();
                } else {
                    this.accordion.nextPage();
                }
            } else if ( event.which === 13 ) {
                const link = this.accordion.accordionEl.getElementsByClassName( 'as-panel' )[ this.accordion.getCurrentIndex() ].querySelector( '.as-panel > a' );

                if ( link !== null ) {
                    link.click();
                }
            }
        };

        this.eventHandlerReferences['keydown'] = keydownHandler;
        document.addEventListener( 'keydown', keydownHandler );
    }

    disable() {
        this.accordion.accordionEl.removeEventListener( 'focus', this.eventHandlerReferences['focus'] );
        this.accordion.accordionEl.removeEventListener( 'blur', this.eventHandlerReferences['blur'] );
        document.removeEventListener( 'keydown', this.eventHandlerReferences['keydown'] );
    }

    // Destroy the module
    destroy() {
        this.accordion.removeEventListener( 'update.' + this.namespace );
        this.disable();
    }
}

export default Keyboard;