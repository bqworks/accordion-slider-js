import Layer from './layer.js';

class Layers {

    // The namespace to be used when adding event listeners
    namespace = 'layers';

    // Reference to the base accordion instance
    accordion;

    // Stores the current settings of the accordion
    settings;

    // Stores the Layer instances
    layers = [];

    constructor( accordion ) {
        this.accordion = accordion;

        this.init();
    }

    init() {
        this.settings = { ...this.defaults, ...this.accordion.settings };

        this.accordion.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
        this.accordion.addEventListener( 'panelOpen.' + this.namespace, this.panelOpenHandler.bind( this ) );

        this.accordion.addEventListener( 'panelsClose.' + this.namespace, ( event ) => {
            this.handleLayersInClosedState( event.detail.previousIndex );
        });
    }

    // Loop through the panels and initialize all layers
    updateHandler() {
        this.settings = { ...this.defaults, ...this.accordion.settings };

        this.accordion.panels.forEach( ( panel, panelIndex ) => {
            let panelEl = panel.panelEl;

            // Initialize the layers
            Array.from( panelEl.querySelectorAll( '.as-layer:not([data-layer-init])' ) ).forEach( ( layerEl ) => {
                let layer = new Layer( layerEl );

                this.layers.push( { layer: layer, panelIndex: panelIndex } );
            });

            if ( this.accordion.currentIndex === panelIndex ) {
                this.handleLayersInOpenedState( panelIndex );
            } else {
                this.handleLayersInClosedState( panelIndex );
            }
        });
    }

    // When a new panel is opened, hide the layers from the previous panel
    // and show the layers from the current panel.
    panelOpenHandler( event ) {
        this.handleLayersInClosedState( event.detail.previousIndex );
        this.handleLayersInOpenedState( event.detail.index );
    }

    handleLayersInOpenedState( index ) {
        const layers = this.layers.filter( ( layerData ) => layerData.panelIndex === index );
        
        layers.forEach( ( layerData ) => {
            const layer = layerData.layer;

            if ( layer.visibleOn === 'opened' ) {
                layer.show();
            } else if ( layer.visibleOn === 'closed' ) {
                layer.hide();
            }
        });
    }

    handleLayersInClosedState( index ) {
        const layers = this.layers.filter( ( layerData ) => layerData.panelIndex === index );
        
        layers.forEach( ( layerData ) => {
            const layer = layerData.layer;

            if ( layer.visibleOn === 'opened' ) {
                layer.hide();
            } else if ( layer.visibleOn === 'closed' ) {
                layer.show();
            }
        });
    }

    // Destroy the module
    destroy() {
        this.accordion.removeEventListener( 'update.' + this.namespace );
        this.accordion.removeEventListener( 'panelOpen.' + this.namespace );

        this.layers.forEach( ( layer ) => {
            layer.destroy();
        });
    }
}

export default Layers;