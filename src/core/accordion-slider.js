import defaults from './accordion-slider-defaults.js';
import { resolveUnit } from '../helpers/util.js';
import AccordionSliderPanel from './accordion-slider-panel.js';
import CustomEventTarget from '../helpers/custom-event-target.js';
import WindowResizeHandler from '../helpers/window-resize-handler.js';
import AddOnsManager from '../add-ons/add-ons-manager.js';

class AccordionSlider extends CustomEventTarget {

    // The namespace to be used when adding event listeners
    namespace = 'accordionslider';

    // Holds the final settings of the accordion after merging the specified
    // ones with the default ones.
    settings = {};

    // Selector for the main element of the accordion
    selector;

    // reference to main accordion element
    accordionEl = null;

    // reference to the container of the panels
    panelsEl = null;

    // reference to the container that will mask the panels
    panelsMaskEl = null;

    // the index of the currently opened panel (starts with 0)
    currentIndex = -1;

    // the index of the current page
    currentPage = 0;

    // the size, in pixels, of the accordion
    totalSize = 0;

    // the size of the panels' container
    totalPanelsSize = 0;

    // the computed size, in pixels, of the opened panel
    computedOpenedPanelSize = 0;

    // the computed maximum allowed size, in pixels, of the opened panel
    maxComputedOpenedPanelSize = 0;

    // the size, in pixels, of the collapsed panels
    collapsedPanelSize = 0;

    // the size, in pixels, of the closed panels
    closedPanelSize = 0;

    // the distance, in pixels, between the accordion's panels
    computedPanelDistance = 0;

    // array that contains the AccordionSliderPanel objects
    panels = [];

    // timer used for delaying the opening of the panel on mouse hover
    mouseDelayTimer = 0;

    // simple objects to be used for animation
    openPanelAnimation = {};
    closePanelsAnimation = {};

    // keeps a reference to the previous number of visible panels
    previousVisiblePanels = -1;

    // indicates whether the accordion is currently scrolling
    isPageScrolling = false;

    // keeps a reference to the ratio between the size actual size of the accordion and the set size
    autoResponsiveRatio = 1;

    // indicates whether the panels will overlap, based on the set panelOverlap property
    // and also based on the computed distance between panels
    isOverlapping = false;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Reference to the WindowResizeHandler instance
    windowResizeHandler;

    // Reference to the AddOnsManager instance
    addOnsManager;

    constructor( selector, options = null ) {
        super();

        this.selector = selector;

        this.settings = options !== null ? { ...defaults, ...options } : { ...defaults };

        this.addOnsManager = new AddOnsManager( this, this.settings.addOns );
        this.addOnsManager.init();

        this.init();
    }

    // The starting place for the accordion slider
    init() {
        this.dispatchEvent( 'beforeInit' );

        this.accordionEl = document.querySelector( this.selector );

        // Remove the 'as-no-js' when the accordion's JavaScript code starts running
        this.accordionEl.classList.remove( 'as-no-js' );

        // Set up the panels containers
        // accordion-slider > as-mask > as-panels > as-panel
        this.panelsMaskEl = document.createElement( 'div' );
        this.panelsMaskEl.classList.add( 'as-mask' );
        this.accordionEl.appendChild( this.panelsMaskEl );

        this.panelsContainerEl = this.accordionEl.getElementsByClassName( 'as-panels' )[ 0 ];

        if ( this.accordionEl.getElementsByClassName( 'as-panels' ).length === 0 ) {
            this.panelsContainerEl = document.createElement( 'div' );
            this.panelsContainerEl.classList.add( 'as-panels' );
        }

        this.panelsMaskEl.appendChild( this.panelsContainerEl );

        if ( this.settings.shuffle === true ) {
            const panels = Array.from( this.panelsContainerEl.getElementsByClassName( 'as-panel' ) );
            const shuffledPanels = [ ...panels ];

            for ( let k = shuffledPanels.length - 1; k > 0; k-- ) {
                let l = Math.floor( Math.random() * ( k + 1 ) );
                let temp = shuffledPanels[ k ];

                shuffledPanels[ k ] = shuffledPanels[ l ];
                shuffledPanels[ l ] = temp;
            }

            this.panelsContainerEl.replaceChildren( ...shuffledPanels );
        }

        // set a panel to be opened from the start
        this.currentIndex = this.settings.startPanel;

        if ( this.currentIndex === -1 ) {
            this.accordionEl.classList.add( 'as-closed' );
        } else {
            this.accordionEl.classList.add( 'as-opened' );
        }

        // if a panels was not set to be opened but a page was specified,
        // set that page index to be opened
        if ( this.settings.startPage !== -1 ) {
            this.currentPage = this.settings.startPage;
        }
        
        this.windowResizeHandler = new WindowResizeHandler();
        this.windowResizeHandler.addEventListener( 'resize', () => {
            this.resize();
        });

        this.update();

        // if there is a panel opened at start handle that panel as if it was manually opened
        if ( this.currentIndex !== -1 ) {
            this.accordionEl.getElementsByClassName( 'as-panel' )[ this.currentIndex ].classList.add( 'as-opened' );

            this.dispatchEvent( 'panelOpen', { index: this.currentIndex, previousIndex: -1 } );
        }

        // listen for 'mouseenter' events
        this.accordionEl.addEventListener( 'mouseenter', this.eventHandlerReferences[ 'mouseenter.accordion' ] = () => {
            this.dispatchEvent( 'accordionMouseOver' );
        });

        // listen for 'mouseleave' events
        this.accordionEl.addEventListener( 'mouseleave', this.eventHandlerReferences[ 'mouseleave.accordion' ] = () => {
            clearTimeout( this.mouseDelayTimer );

            // close the panels
            if ( this.settings.closePanelsOnMouseOut === true ) {
                this.closePanels();
            }

            this.dispatchEvent( 'accordionMouseOut' );
        });

        this.dispatchEvent( 'init' );
    }

    update() {
        this.dispatchEvent( 'beforeUpdate' );

        // add a class to the accordion based on the orientation
        // to be used in CSS
        if ( this.settings.orientation === 'horizontal' ) {
            this.accordionEl.classList.remove( 'as-vertical' );
            this.accordionEl.classList.add( 'as-horizontal' );
        } else if (this.settings.orientation === 'vertical') {
            this.accordionEl.classList.remove( 'as-horizontal' );
            this.accordionEl.classList.add( 'as-vertical' );
        }

        // if the number of visible panels has change, update the current page to reflect
        // the same relative position of the panels
        if ( this.settings.visiblePanels === -1 ) {
            this.currentPage = 0;
        } else if ( this.currentIndex !== -1 ) {
            this.currentPage = Math.floor( this.currentIndex / this.settings.visiblePanels );
        } else if ( this.settings.visiblePanels !== this.previousVisiblePanels && this.previousVisiblePanels !== -1 ) {
            const correctPage = Math.round( ( this.currentPage * this.previousVisiblePanels ) / this.settings.visiblePanels );

            if ( this.currentPage !== correctPage ) {
                this.currentPage = correctPage;
            }

            this.previousVisiblePanels = this.settings.visiblePanels;
        }

        // if there is distance between the panels, the panels can't overlap
        if ( this.settings.panelDistance > 0 || this.settings.panelOverlap === false ) {
            this.isOverlapping = false;
            this.accordionEl.classList.remove( 'as-overlap' );
        } else if ( this.settings.panelOverlap === true ) {
            this.isOverlapping = true;
            this.accordionEl.classList.add( 'as-overlap' );
        }

        // clear inline size of the background images because the orientation might have changes
        [ ...Array.from( this.accordionEl.getElementsByClassName( 'as-background' ) ),
            ...Array.from( this.accordionEl.getElementsByClassName( 'as-background-opened' ) ) ].forEach( ( imageEl ) => {
            imageEl.style.removeProperty( 'width' );
            imageEl.style.removeProperty( 'height' );
        });

        // update panels
        this.updatePanels();

        // create or remove the shadow
        if ( this.settings.shadow === true ) {
            Array.from( this.accordionEl.getElementsByClassName( 'as-panel' ) ).forEach( ( panelEl ) => {
                panelEl.classList.add( 'as-shadow' );
            });
        } else if ( this.settings.shadow === false ) {
            Array.from( this.accordionEl.getElementsByClassName( 'as-shadow' ) ).forEach( ( panelEl ) => {
                panelEl.classList.remove( 'as-shadow' );
            });
        }

        // reset the panels' container position
        this.panelsContainerEl.removeAttribute( 'style' );

        // set the size of the accordion
        this.resize();

        // fire the update event
        this.dispatchEvent( 'update' );
    }

    /*
        Called when the accordion needs to resize 
    */
    resize() {
        this.dispatchEvent( 'beforeResize' );

        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';
        const sizeProperty = this.settings.orientation === 'horizontal' ? 'width' : 'height';

        this.panelsMaskEl.removeAttribute( 'style' );

        // prepare the accordion for responsiveness
        if ( this.settings.responsive === true ) {
            // if the accordion is responsive set the width to 100% and use
            // the specified width and height as a max-width and max-height
            this.accordionEl.style.width = '100%';
            this.accordionEl.style.height = resolveUnit( this.settings.height );
            this.accordionEl.style.maxWidth = resolveUnit( this.settings.width );
            this.accordionEl.style.maxHeight = resolveUnit( this.settings.height );

            // if an aspect ratio was not specified, set the aspect ratio
            // based on the specified width and height
            if ( this.settings.aspectRatio === -1 ) {
                this.settings.aspectRatio = this.settings.width / this.settings.height;
            }

            this.accordionEl.style.height = resolveUnit( this.accordionEl.clientWidth / this.settings.aspectRatio );

            if ( this.settings.responsiveMode === 'auto' ) {
                // get the accordion's size ratio based on the set size and the actual size
                this.autoResponsiveRatio = this.accordionEl.clientWidth / this.settings.width;

                this.panelsMaskEl.style.width = resolveUnit( this.settings.width );

                if ( isNaN( this.settings.height ) ) {
                    this.panelsMaskEl.style.height = resolveUnit( Math.min( this.settings.width / this.settings.aspectRatio, parseInt( this.settings.height, 10 ) / 100 * window.innerHeight ) );
                } else {
                    this.panelsMaskEl.style.height = resolveUnit( Math.min( this.settings.width / this.settings.aspectRatio, this.settings.height ) );
                }

                // scale the mask container based on the current ratio
                if ( this.autoResponsiveRatio < 1 ) {
                    this.panelsMaskEl.style.transform = `scaleX(${ this.autoResponsiveRatio }) scaleY(${ this.autoResponsiveRatio })`;
                    this.panelsMaskEl.style.transformOrigin = 'top left';
                } else {
                    this.panelsMaskEl.style.removeProperty( 'transform' );
                    this.panelsMaskEl.style.removeProperty( 'transform-origin' );
                }
            }
            
            this.totalSize = this.settings.orientation === 'horizontal' ? this.panelsMaskEl.clientWidth : this.panelsMaskEl.clientHeight;
        } else {
            this.accordionEl.style.width = resolveUnit( this.settings.width );
            this.accordionEl.style.height = resolveUnit(  this.settings.height );
            this.accordionEl.style.removeProperty( 'max-width' );
            this.accordionEl.style.removeProperty( 'max-height' );
            
            this.totalSize = this.settings.orientation === 'horizontal' ? this.accordionEl.clientWidth : this.accordionEl.clientHeight;
        }

        // set the size of the background images explicitly because of a bug?
        // that causes anchors not to adapt their size to the size of the image,
        // when the image size is set in percentages, which causes the total size
        // of the panel to be bigger than it should
        [ ...Array.from( this.accordionEl.getElementsByClassName( 'as-background' ) ),
            ...Array.from( this.accordionEl.getElementsByClassName( 'as-background-opened' ) ) ].forEach( ( imageEl ) => {
            if ( this.settings.orientation === 'horizontal' ) {
                imageEl.style.height = resolveUnit( this.panelsContainerEl.clientHeight );
            } else {
                imageEl.style.width = resolveUnit( this.panelsContainerEl.clientWidth );
            }
        });

        // set the initial computedPanelDistance to the value defined in the options
        this.computedPanelDistance = this.settings.panelDistance;

        // parse computedPanelDistance and set it to a pixel value
        if ( typeof this.computedPanelDistance === 'string' ) {
            if ( this.computedPanelDistance.indexOf( '%' ) !== -1 ) {
                this.computedPanelDistance = this.totalSize * ( parseInt( this.computedPanelDistance, 10 ) / 100 );
            } else if ( this.computedPanelDistance.indexOf( 'px' ) !== -1 ) {
                this.computedPanelDistance = parseInt( this.computedPanelDistance, 10 );
            }
        }

        // set the size, in pixels, of the closed panels
        this.closedPanelSize = ( this.totalSize - ( this.getVisiblePanels() - 1 ) * this.computedPanelDistance ) / this.getVisiblePanels();

        // round the value
        this.closedPanelSize = Math.floor( this.closedPanelSize );

        // set the initial computedOpenedPanelSize to the value defined in the options
        this.computedOpenedPanelSize = this.settings.openedPanelSize;

        // if the panels are set to open to their maximum size,
        // parse maxComputedOpenedPanelSize and set it to a pixel value
        if ( this.settings.openedPanelSize === 'max' ) {
            // set the initial maxComputedOpenedPanelSize to the value defined in the options
            this.maxComputedOpenedPanelSize = this.settings.maxOpenedPanelSize;

            if ( typeof this.maxComputedOpenedPanelSize === 'string' ) {
                if ( this.maxComputedOpenedPanelSize.indexOf( '%' ) !== -1 ) {
                    this.maxComputedOpenedPanelSize = this.totalSize * ( parseInt( this.maxComputedOpenedPanelSize, 10 ) / 100 );
                } else if (this.maxComputedOpenedPanelSize.indexOf( 'px' ) !== -1 ) {
                    this.maxComputedOpenedPanelSize = parseInt( this.maxComputedOpenedPanelSize, 10 );
                }
            }
        }

        // parse computedOpenedPanelSize and set it to a pixel value
        if ( typeof this.computedOpenedPanelSize === 'string' ) {
            if ( this.computedOpenedPanelSize.indexOf( '%' ) !== -1 ) {
                this.computedOpenedPanelSize = this.totalSize * ( parseInt( this.computedOpenedPanelSize, 10 ) / 100 );
            } else if ( this.computedOpenedPanelSize.indexOf( 'px' ) !== -1 ) {
                this.computedOpenedPanelSize = parseInt( this.computedOpenedPanelSize, 10 );
            } else if ( this.computedOpenedPanelSize === 'max' && this.currentIndex !== -1 ) {
                const contentSize = this.getPanelAt( this.currentIndex ).getContentSize();
                this.computedOpenedPanelSize = contentSize === 'loading' ? this.closedPanelSize : Math.min( contentSize, this.maxComputedOpenedPanelSize );
            }
        }

        // set the size, in pixels, of the collapsed panels
        this.collapsedPanelSize = ( this.totalSize - this.computedOpenedPanelSize - ( this.getVisiblePanels() - 1 ) * this.computedPanelDistance ) / ( this.getVisiblePanels() - 1 );

        // round the values
        this.computedOpenedPanelSize = Math.floor( this.computedOpenedPanelSize );
        this.collapsedPanelSize = Math.floor( this.collapsedPanelSize );

        // get the total size of the panels' container
        this.totalPanelsSize = this.closedPanelSize * this.getTotalPanels() + this.computedPanelDistance * ( this.getTotalPanels() - 1 );

        this.panelsContainerEl.style[ sizeProperty ] = resolveUnit( this.totalPanelsSize );

        // recalculate the totalSize due to the fact that rounded sizes can cause incorrect positioning
        // since the actual size of all panels from a page might be smaller than the whole width of the accordion
        this.totalSize = this.closedPanelSize * this.getVisiblePanels() + this.computedPanelDistance * ( this.getVisiblePanels() - 1 );

        if ( this.settings.responsiveMode === 'custom' || this.settings.responsive === false ) {
            this.accordionEl.style[ sizeProperty ] = resolveUnit( this.totalSize );
        } else {
            this.accordionEl.style[ sizeProperty ] = resolveUnit( this.totalSize * this.autoResponsiveRatio );
            this.panelsMaskEl.style[ sizeProperty ] = resolveUnit( this.totalSize );
        }

        // if there are multiple pages, set the correct position of the panels' container
        if ( this.settings.visiblePanels !== -1 ) {
            let targetPosition = - ( this.totalSize + this.computedPanelDistance ) * this.currentPage;
            
            if ( this.currentPage === this.getTotalPages() - 1 ) {
                targetPosition = - ( this.closedPanelSize * this.getTotalPanels() + this.computedPanelDistance * ( this.getTotalPanels() - 1 ) - this.totalSize );
            }

            this.panelsContainerEl.style[ positionProperty ] = resolveUnit( targetPosition );
        }

        // calculate missing panels for the last page of panels
        const missingPanels = ( this.currentPage === this.getTotalPages() - 1 ) && ( this.getTotalPanels() % this.settings.visiblePanels ) !== 0 ?
            this.settings.visiblePanels - this.getTotalPanels() % this.settings.visiblePanels :
            0;

        // set the position and size of each panel
        this.panels.forEach( ( panel, index ) => {
            // get the position of the panel based on the currently opened index and the panel's index
            let position;

            if ( this.currentIndex === -1 ) {
                position = index * ( this.closedPanelSize + this.computedPanelDistance );
            } else if ( this.settings.visiblePanels === -1 ) {
                position = index * ( this.collapsedPanelSize + this.computedPanelDistance ) + ( index > this.currentIndex ? this.computedOpenedPanelSize - this.collapsedPanelSize : 0 );
            } else {
                if ( this.getPageOfPanel( index ) === this.currentPage ) {
                    position = this.currentPage * ( this.totalSize + this.computedPanelDistance ) +
                                ( index + missingPanels - this.currentPage * this.settings.visiblePanels ) * ( this.collapsedPanelSize + this.computedPanelDistance ) +
                                ( index > this.currentIndex ? this.computedOpenedPanelSize - this.collapsedPanelSize : 0 );

                    if ( this.currentPage === this.getTotalPages() - 1 && missingPanels !== 0 )
                        position -= ( this.getTotalPages() - this.getTotalPanels() / this.settings.visiblePanels ) * ( this.totalSize + this.computedPanelDistance );
                } else {
                    position = index * ( this.closedPanelSize + this.computedPanelDistance );
                }
            }

            panel.setPosition( position );
            
            // get the size of the panel based on the state of the panel (opened, closed or collapsed)
            if ( this.isOverlapping === false ) {
                const size = ( this.currentIndex === -1 || ( this.settings.visiblePanels !== -1 && this.getPageOfPanel( index ) !== this.currentPage ) ) ?
                    this.closedPanelSize :
                    ( index === this.currentIndex ? this.computedOpenedPanelSize : this.collapsedPanelSize );
                panel.setSize( size );
            }
        });

        this.dispatchEvent( 'resize' );
    }

    /*
        Create, remove or update panels based on the HTML specified in the accordion
    */
    updatePanels() {
        // check if there are removed items in the DOM and remove the from the array of panels
        [ ...this.panels ].forEach( ( panel, index ) => {
            if ( this.accordionEl.querySelector( `.as-panel[data-index="${ index }"]` ) === null ) {
                panel.removeEventListener( 'panelMouseOver' );
                panel.removeEventListener( 'panelMouseOut' );
                panel.removeEventListener( 'panelClick' );
                panel.removeEventListener( 'imagesComplete');
                panel.destroy();

                const indexOfPanel = this.panels.findIndex( panel => panel.index === index );
                this.panels.splice( indexOfPanel, 1 );
            }
        });

        // parse the DOM and create un-instantiated panels and reset the indexes
        Array.from( this.accordionEl.getElementsByClassName( 'as-panel' ) ).forEach( ( panelEl, index ) => {
            if ( panelEl.hasAttribute( 'data-init' ) === false ) {
                const panel = this.createPanel( panelEl );
                this.panels.splice( index, 0, panel );
            }

            this.panels[ index ].settings = this.settings;
            this.panels[ index ].index = index;

            panelEl.style.removeProperty( 'top' );
            panelEl.style.removeProperty( 'left' );
            panelEl.style.removeProperty( 'width' );
            panelEl.style.removeProperty( 'height' );
        });
    }

    /*
        Create an individual panel
    */
    createPanel( panelEl ) {
        // create a panel instance and add it to the array of panels
        const panel = new AccordionSliderPanel( panelEl, this.settings );

        // listen for 'panelMouseOver' events
        panel.addEventListener( 'panelMouseOver', ( event ) => {
            if ( this.isPageScrolling === true ) {
                return;
            }

            if ( this.settings.openPanelOn === 'hover' ) {
                clearTimeout( this.mouseDelayTimer );

                // open the panel, but only after a short delay in order to prevent
                // opening panels that the user doesn't intend
                this.mouseDelayTimer = setTimeout( () => {
                    this.openPanel( event.detail.index );
                }, this.settings.mouseDelay );
            }

            this.dispatchEvent( 'panelMouseOver', { index: event.detail.index } );
        });

        // listen for 'panelMouseOut' events
        panel.addEventListener( 'panelMouseOut', ( event ) => {
            if ( this.isPageScrolling === true ) {
                return;
            }

            this.dispatchEvent( 'panelMouseOut', { index: event.detail.index } );
        });

        // listen for 'panelClick' events
        panel.addEventListener( 'panelClick', ( event ) => {
            if ( this.accordionEl.classList.contains( 'as-swiping' ) ) {
                return;
            }
            
            if ( this.settings.openPanelOn === 'click' ) {
                // open the panel if it's not already opened
                // and close the panels if the clicked panel is opened
                if ( event.detail.index !== this.currentIndex ) {
                    this.openPanel( event.detail.index );
                } else {
                    this.closePanels();
                }
            }

            this.dispatchEvent( 'panelClick', { index: event.detail.index } );
        });

        // disable links if the panel should open on click and it wasn't opened yet
        panel.addEventListener( 'panelMouseDown', ( event ) => {
            const links = panelEl.getElementsByTagName( 'a' );

            if ( links.length < 1 ) {
                return;
            }

            Array.from( links ).forEach( ( linkEl ) => {
                linkEl.removeEventListener( 'click', this.eventHandlerReferences[ 'click.link.panel' ] );
            });

            if ( event.detail.index !== this.currentIndex && this.settings.openPanelOn === 'click' ) {
                Array.from( links ).forEach( ( linkEl ) => {
                    linkEl.addEventListener( 'click', this.eventHandlerReferences[ 'click.link.panel' ] =  ( event ) => {
                        event.preventDefault();
                    });
                });
            }
        });

        // listen for 'imagesComplete' events and if the images were loaded in
        // the panel that is currently opened and the size of the panel is different
        // than the currently computed size of the panel, force the re-opening of the panel
        // to the correct size
        panel.addEventListener( 'imagesComplete', ( event ) => {
            if ( event.detail.index === this.currentIndex && event.detail.contentSize !== this.computedOpenedPanelSize ) {
                this.openPanel( event.detail.index, true );
            }
        });

        return panel;
    }

    /*
        Return the panel at the specified index
    */
    getPanelAt( index ) {
        return this.panels[ index ];
    }

    /*
        Return the index of the currently opened panel
    */
    getCurrentIndex() {
        return this.currentIndex;
    }

    /*
        Return the total amount of panels
    */
    getTotalPanels() {
        return this.panels.length;
    }

    /*
        Open the next panel
    */
    nextPanel() {
        const index = ( this.currentIndex >= this.getTotalPanels() - 1 ) ? 0 : ( this.currentIndex + 1 );
        this.openPanel( index );
    }

    /*
        Open the previous panel
    */
    previousPanel() {
        const index = this.currentIndex <= 0 ?  (this.getTotalPanels() - 1 ) : ( this.currentIndex - 1 );
        this.openPanel( index );
    }

    /*
        Destroy the Accordion Slider instance
    */
    destroy() {
        this.addOnsManager.destroyAll();

        // remove inline style
        this.accordionEl.removeAttribute( 'style' );
        this.panelsContainerEl.removeAttribute( 'style' );

        this.accordionEl.setAttribute( 'class', 'accordion-slider as-no-js' );

        // detach event handlers
        this.accordionEl.removeEventListener( 'mouseenter', this.eventHandlerReferences[ 'mouseenter.accordion' ] );
        this.accordionEl.removeEventListener( 'mouseleave', this.eventHandlerReferences[ 'mouseleave.accordion' ] );

        this.windowResizeHandler.removeEventListener( 'resize' );
        this.windowResizeHandler.destroy();

        // stop animations
        this.stopPanelsAnimation( this.openPanelAnimation );
        this.stopPanelsAnimation( this.closePanelsAnimation );

        // destroy all panels
        this.panels.forEach( ( panel ) => {
            panel.removeEventListener( 'panelMouseOver' );
            panel.removeEventListener( 'panelMouseOut' );
            panel.removeEventListener( 'panelClick' );
            panel.removeEventListener( 'imagesComplete' );

            panel.destroy();
        });

        this.panels.length = 0;

        // move the panels from the mask container back in the main accordion container
        this.accordionEl.insertBefore( this.panelsContainerEl, this.accordionEl.firstChild );

        // remove elements that were created by the script
        this.panelsMaskEl.remove();
    }

    /*
        Animate the panels using request animation frame
    */
    animatePanels( target, args ) {
        const startTime = new Date().valueOf();
        let progress = 0;

        target.isRunning = true;
        target.timer = window.requestAnimationFrame( animate );

        function animate() {
            if ( progress < 1 ) {
                // get the progress by calculating the elapsed time
                progress = ( new Date().valueOf() - startTime ) / args.duration;

                if ( progress > 1 ) {
                    progress = 1;
                }

                // apply swing easing
                progress = 0.5 - Math.cos( progress * Math.PI ) / 2;

                args.step( progress );

                target.timer = window.requestAnimationFrame( animate );
            } else {
                args.complete();

                target.isRunning = false;
                window.cancelAnimationFrame( target.timer );
            }
        }
    }

    /*
        Stop running panel animations
    */
    stopPanelsAnimation( target ) {
        if ( typeof target.isRunning !== 'undefined' && target.isRunning === true ) {
            target.isRunning = false;
            window.cancelAnimationFrame( target.timer );
        }
    }

    /*
        Open the panel at the specified index
    */
    openPanel( index, force ) {
        if ( index === this.currentIndex && force !== true ) {
            return;
        }

        // remove the "closed" class and add the "opened" class, which indicates
        // that the accordion has an opened panel
        if ( this.accordionEl.classList.contains( 'as-closed' ) === true ) {
            this.accordionEl.classList.replace( 'as-closed', 'as-opened' );
        }

        const previousIndex = this.currentIndex;

        this.currentIndex = index;
        
        // synchronize the page with the selected panel by navigating to the page that
        // contains the panel if necessary.
        // if the last page is already selected and the selected panel is on this last page 
        // don't navigate to a different page no matter what panel is selected and whether
        // the panel actually belongs to the previous page
        if ( this.settings.visiblePanels !== -1 && ! ( this.currentPage === this.getTotalPages() - 1 && index >= this.getTotalPanels() - this.settings.visiblePanels ) ) {
            const page = Math.floor( this.currentIndex / this.settings.visiblePanels );

            if ( page !== this.currentPage ) {
                this.gotoPage( page );
            }

            // reset the current index because when the closePanels was called inside gotoPage the current index became -1
            this.currentIndex = index;
        }

        const targetSize = [],
            targetPosition = [],
            startSize = [],
            startPosition = [],
            animatedPanels = [],
            firstPanel = this.getFirstPanelFromPage(),
            lastPanel = this.getLastPanelFromPage();
        
        let counter = 0;

        if ( this.accordionEl.querySelector( '.as-panel.as-opened' ) !== null ) {
            this.accordionEl.querySelector( '.as-panel.as-opened' ).classList.remove( 'as-opened' );
        }
        
        this.accordionEl.getElementsByClassName( 'as-panel' )[ this.currentIndex ].classList.add( 'as-opened' );

        // check if the panel needs to open to its maximum size and recalculate
        // the size of the opened panel and the size of the collapsed panel
        if ( this.settings.openedPanelSize === 'max' ) {
            const contentSize = this.getPanelAt( this.currentIndex ).getContentSize();
            
            this.computedOpenedPanelSize = contentSize === 'loading' ? this.closedPanelSize : Math.min( contentSize, this.maxComputedOpenedPanelSize );

            this.collapsedPanelSize = ( this.totalSize - this.computedOpenedPanelSize - ( this.getVisiblePanels() - 1 ) * this.computedPanelDistance ) / ( this.getVisiblePanels() - 1 );
        }

        // get the starting and target position and size of each panel
        for ( let i = firstPanel; i <= lastPanel; i++ ) {
            let panel = this.getPanelAt( i );
            
            startPosition[ i ] = panel.getPosition();
            targetPosition[ i ] = this.currentPage * ( this.totalSize + this.computedPanelDistance ) +
                                counter * ( this.collapsedPanelSize + this.computedPanelDistance ) +
                                ( i > this.currentIndex ? this.computedOpenedPanelSize - this.collapsedPanelSize : 0 );

            // the last page might contain less panels than the set number of visible panels.
            // in this situation, the last page will contain some panels from the previous page
            // and this requires the panels from the last page to be positioned differently than
            // the rest of the panels. this requires some amendments to the position of the last panels
            // by replacing the current page index with a float number: this.getTotalPanels() / this.settings.visiblePanels, 
            // which would represent the actual number of existing pages.
            // here we subtract the float number from the formal number of pages in order to calculate
            // how much length it's necessary to subtract from the initially calculated value
            if ( this.settings.visiblePanels !== -1 && this.currentPage === this.getTotalPages() - 1 ) {
                targetPosition[ i ] -= ( this.getTotalPages() - this.getTotalPanels() / this.settings.visiblePanels ) * ( this.totalSize + this.computedPanelDistance );
            }

            // check if the panel's position needs to change
            if ( targetPosition[ i ] !== startPosition[ i ] ) {
                animatedPanels.push( i );
            }

            if ( this.isOverlapping === false ) {
                startSize[ i ] = panel.getSize();
                targetSize[ i ] = i === this.currentIndex ? this.computedOpenedPanelSize : this.collapsedPanelSize;

                // check if the panel's size needs to change
                if ( targetSize[ i ] !== startSize[ i ] && animatedPanels.indexOf( i ) === -1 )
                    animatedPanels.push( i );
            }

            counter++;
        }

        const totalPanels = animatedPanels.length;

        // stop the close panels animation if it's on the same page
        if ( this.closePanelsAnimation.page === this.currentPage ) {
            this.stopPanelsAnimation( this.closePanelsAnimation );
        }

        // stop any running animations
        this.stopPanelsAnimation( this.openPanelAnimation );

        // assign the current page
        this.openPanelAnimation.page = this.currentPage;

        // animate the panels
        this.animatePanels( this.openPanelAnimation, {
            duration: this.settings.openPanelDuration,
            step: ( progress ) => {
                for ( let i = 0; i < totalPanels; i++ ) {
                    const value = animatedPanels[ i ],
                        panel = this.getPanelAt( value );

                    panel.setPosition( progress * ( targetPosition[ value ] - startPosition[ value ] ) + startPosition[ value ] );

                    if ( this.isOverlapping === false ) {
                        panel.setSize( progress * ( targetSize[ value ] - startSize[ value ] ) + startSize[ value ] );
                    }
                }
            },
            complete: () => {
                // fire 'panelOpenComplete' event
                this.dispatchEvent( 'panelOpenComplete', { index: this.currentIndex } );
            }
        });

        this.dispatchEvent( 'panelOpen', { index: this.currentIndex, previousIndex: previousIndex } );
    }

    /*
        Close the panels
    */
    closePanels() {
        const previousIndex = this.currentIndex;

        this.currentIndex = -1;

        // remove the "opened" class and add the "closed" class, which indicates
        // that the accordion is closed
        if ( this.accordionEl.classList.contains( 'as-opened' ) === true ) {
            this.accordionEl.classList.replace( 'as-opened', 'as-closed' );
        }

        // remove the "opened" class from the previously opened panel
        if ( this.accordionEl.querySelector( '.as-panel.as-opened' ) !== null ) {
            this.accordionEl.querySelector( '.as-panel.as-opened' ).classList.remove( 'as-opened' );
        }
        
        clearTimeout( this.mouseDelayTimer );

        const targetSize = [],
            targetPosition = [],
            startSize = [],
            startPosition = [],
            firstPanel = this.getFirstPanelFromPage(),
            lastPanel = this.getLastPanelFromPage();
        
        let counter = 0;

        // get the starting and target size and position of each panel
        for ( let i = firstPanel; i <= lastPanel; i++ ) {
            const panel = this.getPanelAt( i );
            
            startPosition[ i ] = panel.getPosition();
            targetPosition[ i ] = this.currentPage * ( this.totalSize + this.computedPanelDistance ) + counter * ( this.closedPanelSize + this.computedPanelDistance );
            
            // same calculations as in openPanel
            if ( this.settings.visiblePanels !== -1 && this.currentPage === this.getTotalPages() - 1 ) {
                targetPosition[ i ] -= ( this.getTotalPages() - this.getTotalPanels() / this.settings.visiblePanels ) * ( this.totalSize + this.computedPanelDistance );
            }

            if ( this.isOverlapping === false ) {
                startSize[ i ] = panel.getSize();
                targetSize[ i ] = this.closedPanelSize;
            }

            counter++;
        }

        // stop the open panel animation if it's on the same page
        if ( this.openPanelAnimation.page === this.currentPage ) {
            this.stopPanelsAnimation( this.openPanelAnimation );
        }

        // stop any running animations
        this.stopPanelsAnimation( this.closePanelsAnimation );

        // assign the current page
        this.closePanelsAnimation.page = this.currentPage;

        // animate the panels
        this.animatePanels( this.closePanelsAnimation, {
            duration: this.settings.closePanelDuration,
            step: ( progress ) => {
                for ( let i = firstPanel; i <= lastPanel; i++ ) {
                    const panel = this.getPanelAt( i );

                    panel.setPosition( progress * ( targetPosition[ i ] - startPosition[ i ] ) + startPosition[ i ] );

                    if ( this.isOverlapping === false ) {
                        panel.setSize( progress * ( targetSize[ i ] - startSize[ i ] ) + startSize[ i ] );
                    }
                }
            },
            complete: () => {
                // fire 'panelsCloseComplete' event
                this.dispatchEvent( 'panelsCloseComplete', { previousIndex: previousIndex } );
            }
        });

        // fire 'panelsClose' event
        this.dispatchEvent( 'panelsClose', { previousIndex: previousIndex } );
    }

    /*
        Return the number of visible panels
    */
    getVisiblePanels() {
        return this.settings.visiblePanels === -1 ? this.getTotalPanels() : this.settings.visiblePanels;
    }

    /*
        Return the total number of pages
    */
    getTotalPages() {
        if ( this.settings.visiblePanels === -1 ) {
            return 1;
        }
        
        return Math.ceil( this.getTotalPanels() / this.settings.visiblePanels );
    }

    /*
        Return the current page
    */
    getCurrentPage() {
        return this.settings.visiblePanels === -1 ? 0 : this.currentPage;
    }

    /*
        Navigate to the indicated page
    */
    gotoPage( index ) {
        // close any opened panels before scrolling to a different page
        if ( this.currentIndex !== -1 ) {
            this.closePanels();
        }

        this.currentPage = index;

        this.isPageScrolling = true;

        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';
        let targetPosition = - ( index * this.totalSize + this.currentPage * this.computedPanelDistance );
        
        if ( this.currentPage === this.getTotalPages() - 1 ) {
            targetPosition = - ( this.totalPanelsSize - this.totalSize );
        }

        // fire 'pageScroll' event
        this.dispatchEvent( 'pageScroll', { index: this.currentPage } );

        this.panelsContainerEl.addEventListener( 'transitionend', () => {
            this.isPageScrolling = false;

            // fire 'pageScrollComplete' event
            this.dispatchEvent( 'pageScrollComplete', { index: this.currentPage } );
        });

        this.panelsContainerEl.style.transition = `${ positionProperty } ${ this.settings.pageScrollDuration / 1000 }s`;
        this.panelsContainerEl.style[ positionProperty ] = resolveUnit( targetPosition );
    }

    /*
        Navigate to the next page
    */
    nextPage() {
        const index = this.currentPage >= this.getTotalPages() - 1 ? 0 : this.currentPage + 1;
        this.gotoPage( index );
    }

    /*
        Navigate to the previous page
    */
    previousPage() {
        const index = this.currentPage <= 0 ? this.getTotalPages() - 1 : this.currentPage - 1;
        this.gotoPage( index );
    }

    /*
        Calculate and return the first panel from the current page
    */
    getFirstPanelFromPage() {
        if ( this.settings.visiblePanels === -1 ) {
            return 0;
        } else if ( this.currentPage === this.getTotalPages() - 1 && this.currentPage !== 0 ) {
            return this.getTotalPanels() - this.settings.visiblePanels;
        } else {
            return this.currentPage * this.settings.visiblePanels;
        }
    }

    /*
        Calculate and return the last panel from the current page
    */
    getLastPanelFromPage() {
        if ( this.settings.visiblePanels === -1 ) {
            return this.getTotalPanels() - 1;
        } else if ( this.currentPage === this.getTotalPages() - 1 ) {
            return this.getTotalPanels() - 1;
        } else {
            return ( this.currentPage + 1 ) * this.settings.visiblePanels - 1;
        }
    }

    /*
        Return the page that the specified panel belongs to
    */
    getPageOfPanel( index ) {
        if ( this.currentPage === this.getTotalPages() - 1 && index >= this.getTotalPanels() - this.settings.visiblePanels )
            return this.getTotalPages() - 1;

        return Math.floor( index / this.settings.visiblePanels );
    }
}

export default AccordionSlider;