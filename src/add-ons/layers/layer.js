import { resolveUnit } from '../../helpers/util.js';

class Layer {

    // Reference to the layer jQuery element
    layerEl;

    // Indicates whether a layer is currently visible or hidden
    visible = false;

    visibleOn = 'as-always';

    // Indicates whether the layer was styled
    styled = false;

    // Holds the data attributes added to the layer
    data = null;

    // Indicates the layer's reference point (topLeft, bottomLeft, topRight or bottomRight)
    position = null;
	
    // Indicates which CSS property (left or right) will be used for positioning the layer 
    horizontalProperty = null;
	
    // Indicates which CSS property (top or bottom) will be used for positioning the layer 
    verticalProperty = null;

    // Indicates the value of the horizontal position
    horizontalPosition = null;
	
    // Indicates the value of the vertical position
    verticalPosition = null;

    // Reference to the timer that will be used to hide/show the layers
    delayTimer = null;

    // Reference to the timer that will be used to hide the layers automatically after a given time interval
    stayTimer = null;

    constructor( layerEl ) {
        this.layerEl = layerEl;

        this.init();
    }

    // Initialize the layers
    init() {
        this.layerEl.setAttribute( 'data-layer-init', true );

        if ( this.layerEl.classList.contains( 'as-closed' ) ) {
            this.visibleOn = 'closed';
            this.layerEl.style.visibility = 'hidden';
        } else if ( this.layerEl.classList.contains( 'as-opened' ) ) {
            this.visibleOn = 'opened';
            this.layerEl.style.visibility = 'hidden';
        } else {
            this.setStyle();
        }
    }

    // Set the size and position of the layer
    setStyle() {
        this.styled = true;

        // Get the data attributes specified in HTML
        this.data = this.layerEl.dataset;

        if ( typeof this.data.width !== 'undefined' ) {
            this.layerEl.style.width = resolveUnit( this.data.width );
        }

        if ( typeof this.data.height !== 'undefined' ) {
            this.layerEl.style.height = resolveUnit( this.data.height );
        }

        if ( typeof this.data.depth !== 'undefined' ) {
            this.layerEl.style.zIndex = this.data.depth;
        }

        this.position = this.data.position ? ( this.data.position ).toLowerCase() : 'topleft';

        if ( this.position.indexOf( 'right' ) !== -1 ) {
            this.horizontalProperty = 'right';
        } else if ( this.position.indexOf( 'left' ) !== -1 ) {
            this.horizontalProperty = 'left';
        } else {
            this.horizontalProperty = 'center';
        }

        if ( this.position.indexOf( 'bottom' ) !== -1 ) {
            this.verticalProperty = 'bottom';
        } else if ( this.position.indexOf( 'top' ) !== -1 ) {
            this.verticalProperty = 'top';
        } else {
            this.verticalProperty = 'center';
        }

        this.setPosition();
    }

    // Set the position of the layer
    setPosition() {
        let inlineStyle = this.layerEl.getAttribute( 'style' );

        this.horizontalPosition = typeof this.data.horizontal !== 'undefined' ? this.data.horizontal : 0;
        this.verticalPosition = typeof this.data.vertical !== 'undefined' ? this.data.vertical : 0;

        // Set the horizontal position of the layer based on the data set
        if ( this.horizontalProperty === 'center' || this.horizontalPosition === 'center' ) {
			
            // prevent content wrapping while setting the width
            if ( this.layerEl.tagName !== 'IMG' && ( inlineStyle === null || ( inlineStyle !== null && inlineStyle.indexOf( 'width' ) === -1 ) ) ) {
                this.layerEl.style.whiteSpace = 'nowrap';
                this.layerEl.style.width = resolveUnit( this.layerEl.clientWidth );
            }

            this.layerEl.style.marginLeft = 'auto';
            this.layerEl.style.marginRight = 'auto';
            this.layerEl.style.left = 0;
            this.layerEl.style.right = 0;
        } else {
            this.layerEl.style[ this.horizontalProperty ] = resolveUnit( this.horizontalPosition );
        }

        // Set the vertical position of the layer based on the data set
        if ( this.verticalProperty === 'center' || this.verticalPosition === 'center' ) {

            // prevent content wrapping while setting the height
            if ( this.layerEl.tagName !== 'IMG' && ( inlineStyle === null || ( inlineStyle !== null && inlineStyle.indexOf( 'height' ) === -1 ) ) ) {
                this.layerEl.style.whiteSpace = 'nowrap';
                this.layerEl.style.height = resolveUnit( this.layerEl.clientHeight );
            }

            this.layerEl.style.marginTop = 'auto';
            this.layerEl.style.marginBottom = 'auto';
            this.layerEl.style.top = 0;
            this.layerEl.style.bottom = 0;
        } else {
            this.layerEl.style[ this.verticalProperty ] = resolveUnit( this.verticalPosition );
        }
    }

    // Show the layer
    show( callback ) {
        if ( this.visible === true ) {
            return;
        }

        this.visible = true;

        // First, style the layer if it's not already styled
        if ( this.styled === false ) {
            this.setStyle();
        }

        let offset = typeof this.data.showOffset !== 'undefined' ? this.data.showOffset : 50,
            duration = typeof this.data.showDuration !== 'undefined' ? this.data.showDuration / 1000 : 0.4,
            delay = typeof this.data.showDelay !== 'undefined' ? this.data.showDelay : 10,
            stayDuration = typeof this.data.stayDuration !== 'undefined' ? parseInt( this.data.stayDuration, 10 ) : -1;

        let start = { 'opacity': 0, 'visibility': 'visible' },
            target = { 'opacity': 1 },
            transformValues = '';

        target[ 'transition' ] = 'opacity ' + duration + 's';

        if ( typeof this.data.showTransition !== 'undefined' ) {
            if ( this.data.showTransition === 'left' ) {
                transformValues = offset + 'px, 0';
            } else if ( this.data.showTransition === 'right' ) {
                transformValues = '-' + offset + 'px, 0';
            } else if ( this.data.showTransition === 'up' ) {
                transformValues = '0, ' + offset + 'px';
            } else if ( this.data.showTransition === 'down') {
                transformValues = '0, -' + offset + 'px';
            }

            start[ 'transform' ] = 'translate3d(' + transformValues + ', 0)';
            target[ 'transform' ] = 'translate3d(0, 0, 0)';
            target[ 'transition' ] += ', ' + 'transform ' + duration + 's';
        }

        const transitionEndHandler = ( event ) => {
            if ( event.target !== event.currentTarget ) {
                return;
            }

            this.layerEl.removeEventListener( 'transitionend', transitionEndHandler );
            this.layerEl.style.transition = '';

            // Hide the layer after a given time interval
            if ( stayDuration !== -1 ) {
                this.stayTimer = setTimeout(function() {
                    this.hide();
                    this.stayTimer = null;
                }, stayDuration );
            }

            if ( typeof callback !== 'undefined' ) {
                callback();
            }
        };
			
        // Listen when the layer animation is complete
        this.layerEl.addEventListener( 'transitionend', transitionEndHandler );

        for ( let property in start ) {
            this.layerEl.style[ property ] = start[ property ];
        }

        this.delayTimer = setTimeout( () => {
            for ( let property in target ) {
                this.layerEl.style[ property ] = target[ property ];
            }
        }, delay );
    }

    // Hide the layer
    hide( callback ) {
        if ( this.visible === false ) {
            return;
        }

        let offset = typeof this.data.hideOffset !== 'undefined' ? this.data.hideOffset : 50,
            duration = typeof this.data.hideDuration !== 'undefined' ? this.data.hideDuration / 1000 : 0.4,
            delay = typeof this.data.hideDelay !== 'undefined' ? this.data.hideDelay : 10;

        this.visible = false;

        // If the layer is hidden before it hides automatically, clear the timer
        if ( this.stayTimer !== null ) {
            clearTimeout( this.stayTimer );
        }

        // Animate the layers with CSS3 or with JavaScript
        let transformValues = '',
            target = { 'opacity': 0 };

        target[ 'transition' ] = 'opacity ' + duration + 's';

        if ( typeof this.data.hideTransition !== 'undefined' ) {
            if ( this.data.hideTransition === 'left' ) {
                transformValues = '-' + offset + 'px, 0';
            } else if ( this.data.hideTransition === 'right' ) {
                transformValues = offset + 'px, 0';
            } else if ( this.data.hideTransition === 'up' ) {
                transformValues = '0, -' + offset + 'px';
            } else if ( this.data.hideTransition === 'down' ) {
                transformValues = '0, ' + offset + 'px';
            }

            target[ 'transform' ] = ' translate3d(' + transformValues + ', 0)';
            target[ 'transition' ] += ', ' + 'transform ' + duration + 's';
        }

        // Listen when the layer animation is complete
        const transitionEndHandler = ( event ) => {
            if ( event.target !== event.currentTarget ) {
                return;
            }

            this.layerEl.removeEventListener( 'transitionend', transitionEndHandler );
            this.layerEl.style.removeProperty( 'transition' );

            // Hide the layer after transition
            if ( this.visible === false ) {
                this.layerEl.style.visibility = 'hidden';
            }

            if ( typeof callback !== 'undefined' ) {
                callback();
            }
        };

        this.layerEl.addEventListener( 'transitionend', transitionEndHandler );

        this.delayTimer = setTimeout( () => {
            for ( let property in target ) {
                this.layerEl.style[ property ] = target[ property ];
            }
        }, delay );
    }

    isVisible() {
        if ( this.visible === false || this.layerEl.offsetParent === null ) {
            return false;
        }

        return true;
    }

    // Destroy the layer
    destroy() {
        this.layerEl.removeAttribute( 'style' );
        this.layerEl.removeAttribute( 'data-layer-init' );
        clearTimeout( this.delayTimer );
        clearTimeout( this.stayTimer );
        this.delayTimer = null;
        this.stayTimer = null;
    }
}

export default Layer;