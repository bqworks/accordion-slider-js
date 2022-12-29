import { checkImagesComplete, checkImagesStatus, resolveUnit } from '../helpers/util.js';
import CustomEventTarget from '../helpers/custom-event-target.js';

class AccordionSliderPanel extends CustomEventTarget {

    // Index of the panel
    #index;

    // Reference to the panel element
    panelEl;

    // reference to the global settings of the accordion
    settings;

    isLoading = false;

    isLoaded = false;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    constructor( panel, settings ) {
        super();

        this.panelEl = panel;
        this.settings = settings;

        // Initialize the panel
        this.init();
    }

    // The starting point for the panel
    init() {
        // Mark the panel as initialized
        this.panelEl.setAttribute( 'data-init', true );

        // listen for 'mouseenter' events
        this.panelEl.addEventListener( 'mouseenter', this.eventHandlerReferences[ 'mouseenter.panel' ] = () => {
            this.dispatchEvent( 'panelMouseOver', { index: this.index } );
        });

        // listen for 'mouseleave' events
        this.panelEl.addEventListener( 'mouseleave', this.eventHandlerReferences[ 'mouseleave.panel' ] = () => {
            this.dispatchEvent( 'panelMouseOut', { index: this.index } );
        });

        // listen for 'click' events
        this.panelEl.addEventListener( 'click', this.eventHandlerReferences[ 'click.panel' ] = () => {
            this.dispatchEvent( 'panelClick', { index: this.index } );
        });

        // listen for 'mousedown' events
        this.panelEl.addEventListener( 'mousedown', this.eventHandlerReferences[ 'mousedown.panel' ] = () => {
            this.dispatchEvent( 'panelMouseDown', { index: this.index } );
        });
    }

    getPosition() {
        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';

        return parseInt( this.panelEl.style[ positionProperty ], 10 );
    }

    setPosition( value ) {
        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';

        this.panelEl.style[ positionProperty ] = resolveUnit( value );
    }

    getSize() {
        const sizeProperty = this.settings.orientation === 'horizontal' ? 'width' : 'height';

        return parseInt( this.panelEl.style[ sizeProperty ], 10 );
    }

    setSize( value ) {
        const sizeProperty = this.settings.orientation === 'horizontal' ? 'width' : 'height';

        this.panelEl.style[ sizeProperty ] = resolveUnit( value );
    }

    getContentSize() {
        if ( checkImagesStatus( this.panelEl ) === 'complete' ) {
            this.isLoaded = true;
        }

        // check if there are loading images
        if ( this.isLoaded === false ) {
            checkImagesComplete( this.panelEl ).then( () => {
                this.isLoaded = true;

                this.dispatchEvent( 'imagesComplete', { index: this.index, contentSize: this.getContentSize() } );
            });

            return 'loading';
        }

        const { width, height } = this.calculateSize();

        return this.settings.orientation === 'horizontal' ? width : height;
    }

    calculateSize() {
        let width = this.panelEl.clientWidth,
            height = this.panelEl.clientHeight;
        
        Array.from( this.panelEl.children ).forEach( ( childEl ) => {
            if ( childEl.style.visibility === 'hidden' || childEl.style.display === 'none' ) {
                return;
            }

            const { left, right, top, bottom } = childEl.getBoundingClientRect();
            const bottomEdge = childEl.offsetTop + ( bottom - top );
            const rightEdge = childEl.offsetLeft + ( right - left );

            if ( bottomEdge > height ) {
                height = bottomEdge;
            }

            if ( rightEdge > width ) {
                width = rightEdge;
            }
        });

        return {
            width,
            height
        };
    }

    // Destroy the slide
    destroy() {
        // Clean the panel element from attached styles and data
        this.panelEl.removeAttribute( 'style' );
        this.panelEl.removeAttribute( 'data-init' );
        this.panelEl.removeAttribute( 'data-index' );

        // detach all event listeners
        this.panelEl.removeEventListener( 'mouseenter', this.eventHandlerReferences[ 'mouseenter.panel' ] );
        this.panelEl.removeEventListener( 'mouseleave', this.eventHandlerReferences[ 'mouseleave.panel' ] );
        this.panelEl.removeEventListener( 'click', this.eventHandlerReferences[ 'click.panel' ] );
        this.panelEl.removeEventListener( 'mousedown', this.eventHandlerReferences[ 'mousedown.panel' ] );
    }

    // Return the index of the slide
    get index() {
        return this.#index;
    }

    // Set the index of the slide
    set index( index ) {
        this.#index = index;
        this.panelEl.setAttribute( 'data-index', this.#index );
    }
}

export default AccordionSliderPanel;