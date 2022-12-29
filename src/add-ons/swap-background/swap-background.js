class SwapBackground {

    // The namespace to be used when adding event listeners
    namespace = 'swapbackground';

    // Reference to the base accordion instance
    accordion;

    // Stores the current settings of the accordion
    settings;

    eventHandlerReferences = {};

    defaults = {
        swapBackgroundDuration: 700,
        fadeOutBackground: false
    };

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        this.settings = { ...this.defaults, ...this.accordion.settings };

        this.accordion.addEventListener( 'panelOpen.' + this.namespace, ( event ) => {
            // get the currently opened panel
            const panel = this.accordion.getPanelAt( event.detail.index ),
                background = panel.panelEl.getElementsByClassName( 'as-background' )[ 0 ],
                opened = panel.panelEl.getElementsByClassName( 'as-background-opened' )[ 0 ];

            // fade in the opened content
            if ( typeof opened !== 'undefined' ) {
                opened.style.visibility = 'visible';
                opened.style.opacity = 0;

                this.fadeIn( opened );

                if ( typeof background !== 'undefined' && this.settings.fadeOutBackground === true )
                    this.fadeOut( background );
            }

            if ( event.detail.previousIndex !== -1 && event.detail.index !== event.detail.previousIndex ) {
                // get the previously opened panel
                const previousPanel = this.accordion.getPanelAt( event.detail.previousIndex ),
                    previousBackground = previousPanel.panelEl.getElementsByClassName( 'as-background' )[ 0 ],
                    previousOpened = previousPanel.panelEl.getElementsByClassName( 'as-background-opened' )[ 0 ];

                // fade out the opened content
                if ( typeof previousOpened !== 'undefined' ) {
                    this.fadeOut( previousOpened );

                    if ( typeof previousBackground !== 'undefined' && this.settings.fadeOutBackground === true )
                        this.fadeIn( previousBackground );
                }
            }
        });

        this.accordion.addEventListener( 'panelsClose.' + this.namespace, ( event ) => {
            if ( event.detail.previousIndex === -1 ) {
                return;
            }

            // get the previously opened panel
            const panel = this.accordion.getPanelAt( event.detail.previousIndex ),
                background = panel.panelEl.getElementsByClassName( 'as-background' )[ 0 ],
                opened = panel.panelEl.getElementsByClassName( 'as-background-opened' )[ 0 ];

            // fade out the opened content
            if ( typeof opened !== 'undefined' ) {
                this.fadeOut( opened );

                if ( typeof background !== 'undefined' && this.settings.fadeOutBackground === true )
                    this.fadeIn( background );
            }
        });
    }

    fadeIn( target ) {
        target.style.visibility = 'visible';
		
        target.removeEventListener( 'transitionend', this.eventHandlerReferences[ 'transitionend.fadein' ] );

        target.addEventListener( 'transitionend', this.eventHandlerReferences[ 'transitionend.fadein' ] = ( event ) => {
            if ( event.target !== event.currentTarget ) {
                return;
            }

            target.removeEventListener( 'transitionend', this.eventHandlerReferences[ 'transitionend.fadein' ] );
            target.style.removeProperty( 'transition' );
        });

        setTimeout(() => {
            target.style.opacity = 1;
            target.style.transition = 'all ' + this.settings.swapBackgroundDuration / 1000 + 's';
        }, 100 );
    }

    fadeOut( target ) {
		
        target.removeEventListener( 'transitionend', this.eventHandlerReferences[ 'transitionend.fadeout' ] );

        target.addEventListener( 'transitionend', this.eventHandlerReferences[ 'transitionend.fadeout' ] = ( event ) => {
            if ( event.target !== event.currentTarget ) {
                return;
            }

            target.removeEventListener( 'transitionend', this.eventHandlerReferences[ 'transitionend.fadeout' ] );
            target.style.removeProperty( 'transition' );
            target.style.visibility = 'hidden';
        });

        setTimeout(() => {
            target.style.opacity = 0;
            target.style.transition = 'all ' + this.settings.swapBackgroundDuration / 1000 + 's';
        }, 100 );
    }

    destroy() {
        this.removeEventListener( 'panelOpen.' + this.namespace );
        this.removeEventListener( 'panelsClose.' + this.namespace );
    }
}

export default SwapBackground;