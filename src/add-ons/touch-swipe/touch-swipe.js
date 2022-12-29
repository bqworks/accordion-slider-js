import { getParent, resolveUnit } from '../../helpers/util.js';

class TouchSwipe {

    // The namespace to be used when adding event listeners
    namespace = 'touchswipe';

    // Reference to the base accordion instance
    accordion;

    // Stores the current settings of the accordion
    settings;

    // Indicates whether the touch swipe is enabled for slides
    isTouchSwipeEnabled = false;

    // The x and y coordinates of the pointer/finger's starting position
    touchStartPoint = { x: 0, y: 0 };

    // The x and y coordinates of the pointer/finger's end position
    touchEndPoint = { x: 0, y: 0 };

    // The distance from the starting to the end position on the x and y axis
    touchDistance = { x: 0, y: 0 };

    // The position of the slides when the touch swipe starts
    touchStartPosition = 0;

    // Indicates if the slides are being swiped
    isTouchMoving = false;

    // Stores the names of the events
    touchSwipeEvents = {
        startEvent: [ 'touchstart', 'mousedown' ],
        moveEvent: [ 'touchmove', 'mousemove' ],
        endEvent: [ 'touchend', 'mouseup' ]
    };

    // Indicates whether the previous 'start' event was a 'touchstart' or 'mousedown'
    previousStartEvent = '';

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {
		
        // Indicates whether the touch swipe will be enabled
        touchSwipe: true,

        // Sets the minimum amount that the slides should move
        touchSwipeThreshold: 50
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

        // check if touch swipe is enabled
        if ( this.settings.touchSwipe === true && this.isTouchSwipeEnabled === false ) {
            this.add();
        } else if ( this.settings.touchSwipe === false && this.isTouchSwipeEnabled === true ) {
            this.destroy();
        }

        // Add the grabbing icon
        if ( this.accordion.getTotalPages() > 1 ) {
            this.accordion.panelsContainerEl.classList.add( 'as-grab' );
        } else {
            this.accordion.panelsContainerEl.classList.remove( 'as-grab' );
        }
    }

    add() {
        this.isTouchSwipeEnabled = true;

        // Listen for touch swipe/mouse move events
        Array.from( this.touchSwipeEvents.startEvent ).forEach( ( eventType ) => {
            this.accordion.panelsContainerEl.addEventListener( eventType, this.eventHandlerReferences[ eventType ] = ( event ) => {
                this.touchStartHandler( event );
            });
        });
		
        this.accordion.panelsContainerEl.addEventListener( 'dragstart', this.eventHandlerReferences[ 'dragstart' ] = ( event ) => {
            event.preventDefault();
        });

        // Prevent 'click' events unless there is intention for a 'click'
        Array.from( this.accordion.panelsContainerEl.getElementsByTagName( 'a' ) ).forEach( ( element ) => {
            element.addEventListener( 'click', this.eventHandlerReferences[ 'click.link' ] = ( event ) => {
                if ( this.accordion.accordionEl.classList.contains( 'as-swiping' ) ) {
                    event.preventDefault();
                }
            });
        });

        // prevent 'tap' events unless the panel is opened
        this.accordion.panelsContainerEl.addEventListener( 'touchstart', this.eventHandlerReferences[ 'touchstart.link' ] = () => {
            const disabledLinks = this.accordion.panelsContainerEl.querySelectorAll( '[data-disabledlink]' );

            Array.from( disabledLinks ).forEach( ( linkEl ) => {
                linkEl.style.removeProperty( 'pointer-events' );
                linkEl.removeAttribute( 'data-disabledlink' );
            });
        });

        Array.from( this.accordion.panelsContainerEl.getElementsByTagName( 'a' ) ).forEach( ( linkEl ) => {
            linkEl.addEventListener( 'touchend', this.eventHandlerReferences[ 'touchend.link' ] = () => {
                const parentPanel = getParent( linkEl, 'as-panel' );

                if ( parentPanel !== null && parentPanel.classList.contains( 'as-opened' ) === false ) {
                    linkEl.style[ 'pointer-events' ] = 'none';
                    linkEl.setAttribute( 'data-disabledlink', true );
                }
            });
        });
    }

    // Called when the slides starts being dragged
    touchStartHandler( event ) {

        // Return if a 'mousedown' event follows a 'touchstart' event
        if ( event.type === 'mousedown' && this.previousStartEvent === 'touchstart' ) {
            this.previousStartEvent = event.type;
            return;
        }

        // Assign the new 'start' event
        this.previousStartEvent = event.type;

        // Disable dragging if the element is set to allow selections
        if ( event.target.classList.contains( 'as-selectable' ) ) {
            return;
        }

        const eventObject = typeof event.touches !== 'undefined' ? event.touches[0] : event;
        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';

        // Get the initial position of the mouse pointer and the initial position
        // of the slides' container
        this.touchStartPoint.x = eventObject.pageX || eventObject.clientX;
        this.touchStartPoint.y = eventObject.pageY || eventObject.clientY;
        this.touchStartPosition = parseInt( this.accordion.panelsContainerEl.style[ positionProperty ], 10 );

        // Clear the previous distance values
        this.touchDistance.x = this.touchDistance.y = 0;

        // Listen for move and end events
        Array.from( this.touchSwipeEvents.moveEvent ).forEach( ( eventType ) => {
            this.accordion.panelsContainerEl.addEventListener( eventType, this.eventHandlerReferences[ eventType ] = ( event ) => {
                this.touchMoveHandler( event );
            });
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            document.addEventListener( eventType, this.eventHandlerReferences[ eventType ] = ( event ) => {
                this.touchEndHandler( event );
            });
        });

        // Swap grabbing icons
        this.accordion.panelsContainerEl.classList.replace( 'as-grab', 'as-grabbing' );
    }

    // Called during the slides' dragging
    touchMoveHandler( event ) {
        const eventObject = typeof event.touches !== 'undefined' ? event.touches[0] : event;
        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';

        // Indicate that the move event is being fired
        this.isTouchMoving = true;

        // Add 'as-swiping' class to indicate that the slides are being swiped
        if ( this.accordion.accordionEl.classList.contains( 'as-swiping' ) === false ) {
            this.accordion.accordionEl.classList.add( 'as-swiping' );
        }

        // Get the current position of the mouse pointer
        this.touchEndPoint.x = eventObject.pageX || eventObject.clientX;
        this.touchEndPoint.y = eventObject.pageY || eventObject.clientY;

        // Calculate the distance of the movement on both axis
        this.touchDistance.x = this.touchEndPoint.x - this.touchStartPoint.x;
        this.touchDistance.y = this.touchEndPoint.y - this.touchStartPoint.y;

        // Calculate the distance of the swipe that takes place in the same direction as the orientation of the panels
        // and calculate the distance from the opposite direction.
        // 
        // For a swipe to be valid there should more distance in the same direction as the orientation of the panels.
        let distance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y;

        // If opposite scrolling is still allowed, the swipe wasn't valid, so return.
        if ( this.allowOppositeScrolling === true ) {
            return;
        }
		
        // Don't allow opposite scrolling
        event.preventDefault();

        // get the current position of panels' container
        const currentPanelsPosition = parseInt( this.accordion.panelsContainerEl.style[ positionProperty ], 10 );
        
        // reduce the movement speed if the panels' container is outside its bounds
        if ( ( currentPanelsPosition >= 0 && this.accordion.currentPage === 0 ) || ( currentPanelsPosition <= - this.accordion.totalPanelsSize + this.accordion.totalSize && this.accordion.currentPage === this.accordion.getTotalPages() - 1 ) ) {
            distance = distance * 0.2;
        }

        // move the panels' container
        this.accordion.panelsContainerEl.style[ positionProperty ] = resolveUnit( this.touchStartPosition + distance );
    }

    // Called when the slides are released
    touchEndHandler() {
        let touchDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y;
        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';

        // Remove the 'move' and 'end' listeners
        Array.from( this.touchSwipeEvents.moveEvent ).forEach( ( eventType ) => {
            this.accordion.panelsContainerEl.removeEventListener( eventType, this.eventHandlerReferences[ eventType ] );
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            document.removeEventListener( eventType, this.eventHandlerReferences[ eventType ] );
        });

        // Swap grabbing icons
        this.accordion.panelsContainerEl.classList.replace( 'as-grabbing', 'as-grab' );

        // Remove the 'as-swiping' class with a delay, to allow
        // other event listeners (i.e. click) to check the existence
        // of the swipe event.
        if ( this.accordion.accordionEl.classList.contains( 'as-swiping' ) ) {
            setTimeout(() => {
                this.accordion.accordionEl.classList.remove( 'as-swiping' );
            }, 100 );
        }

        // Return if the slides didn't move
        if ( this.isTouchMoving === false ) {
            return;
        }

        this.isTouchMoving = false;

        if ( touchDistance > this.settings.touchSwipeThreshold) {
            if ( this.accordion.currentPage > 0 ) {
                this.accordion.previousPage();
            } else {
                this.accordion.panelsContainerEl.style[ positionProperty ] = this.touchStartPosition;
            }
        } else if ( - touchDistance > this.settings.touchSwipeThreshold) {
            if ( this.accordion.currentPage < this.accordion.getTotalPages() - 1 ) {
                this.accordion.nextPage();
            } else {
                this.accordion.gotoPage( this.accordion.currentPage );
            }
        } else if ( Math.abs( touchDistance ) < this.settings.touchSwipeThreshold ) {
            this.accordion.panelsContainerEl.style[ positionProperty ] = resolveUnit( this.touchStartPosition );
        }
    }

    // Destroy the module
    destroy() {
        this.isTouchSwipeEnabled = false;

        this.accordion.removeEventListener( 'update.' + this.namespace );

        this.accordion.panelsContainerEl.removeEventListener( 'dragstart', this.eventHandlerReferences[ 'dragstart' ] );
        this.accordion.panelsContainerEl.removeEventListener( 'touchstart', this.eventHandlerReferences[ 'touchstart.link' ] );

        Array.from( this.accordion.panelsContainerEl.getElementsByTagName( 'a' ) ).forEach( ( linkEl ) => {
            linkEl.removeEventListener( 'click', this.eventHandlerReferences[ 'click.link' ] );
            linkEl.removeEventListener( 'touchend', this.eventHandlerReferences[ 'touchend.link' ] );
        });

        Array.from( [ ...this.touchSwipeEvents.startEvent , ...this.touchSwipeEvents.moveEvent ] ).forEach( ( eventType ) => {
            this.accordion.panelsContainerEl.removeEventListener( eventType, this.eventHandlerReferences[ eventType ] );
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            document.removeEventListener( eventType, this.eventHandlerReferences[ eventType ] );
        });
		
        this.accordion.panelsContainerEl.classList.remove( 'as-grab' );
    }
}

export default TouchSwipe;