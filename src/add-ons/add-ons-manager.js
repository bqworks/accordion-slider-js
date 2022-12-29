class AddOnsManager {

    // Reference to the base accordion instance
    accordion;

    // Stores the add-on classes
    static addOns = [];

    // Stores instances of the add-ons
    addOnsInstances = [];

    activeAddOns = null;

    constructor( accordion, activeAddOns = null ) {
        this.accordion = accordion;
        this.activeAddOns = activeAddOns;
    }

    init() {
        this.accordion.addOns = this.accordion.addOns || {};

        const addOnsToInstantiate = this.activeAddOns.length === 0 ? AddOnsManager.addOns : this.activeAddOns;

        addOnsToInstantiate.forEach( ( addOn ) => {
            let addOnInstance = new addOn( this.accordion );
            this.addOnsInstances.push( addOnInstance );
            this.accordion.addOns[ addOn.name ] = addOnInstance;
        });
    }

    static add( addOns ) {
        if ( typeof addOns === 'object' ) {
            AddOnsManager.addOns = [ ...AddOnsManager.addOns, ...addOns ];
        } else if ( typeof addOns === 'function' ) {
            AddOnsManager.addOns.push( addOns );
        }
    }

    destroyAll() {
        this.addOnsInstances.forEach( ( addOn ) => {
            addOn.destroy();
        });
    }
}

export default AddOnsManager;