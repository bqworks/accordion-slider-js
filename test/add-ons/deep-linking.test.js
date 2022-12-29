import AccordionSlider from '../../src/core/accordion-slider.js';
import DeepLinking from '../../src/add-ons/deep-linking/deep-linking.js';
import { basicAccordion } from '../assets/html/html.js';

let accordion;

beforeAll( ()=> {
    document.body.innerHTML = basicAccordion;
});

describe( 'deep-linking add-on', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider', {
            addOns: [ DeepLinking ],
            updateHash: true
        });
    });

    test( 'should update the url hash when the accordion navigates to a panel', () => {
        accordion.openPanel( 2 );

        expect( window.location.hash ).toBe( '#accordion-slider/2' );
    });

    test( 'should navigate to the corresponding panel based on url location', () => {
        window.location.href = window.location.origin + '/#accordion-slider/3';
        window.dispatchEvent( new Event( 'hashchange' ) );

        expect( accordion.getCurrentIndex() ).toBe( 3 );
    });
});