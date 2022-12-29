import AccordionSlider from '../../src/core/accordion-slider.js';
import MouseWheel from '../../src/add-ons/mouse-wheel/mouse-wheel.js';
import { basicAccordion } from '../assets/html/html.js';

let accordion;

beforeAll( ()=> {
    document.body.innerHTML = basicAccordion;
});

describe( 'mouse wheel add-on', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider', {
            addOns: [ MouseWheel ],
            startPanel: 0
        });
    });

    test( 'should navigate to the next panel using the mouse wheel', () => {
        const initialPanelIndex = accordion.getCurrentIndex();

        accordion.accordionEl.dispatchEvent( new WheelEvent( 'wheel', { deltaY: 20 } ) );

        const finalPanelIndex = accordion.getCurrentIndex();

        expect( finalPanelIndex ).not.toBe( initialPanelIndex );
        expect( [ initialPanelIndex + 1, 0 ] ).toContain( finalPanelIndex );
    });

    test( 'should navigate to the previous panel using the mouse wheel', async () => {
        await new Promise( resolve => setTimeout( resolve, 1000 ) );
        
        const initialPanelIndex = accordion.getCurrentIndex();

        accordion.accordionEl.dispatchEvent( new WheelEvent( 'wheel', { deltaY: - 20 } ) );

        const finalPanelIndex = accordion.getCurrentIndex();

        expect( finalPanelIndex ).not.toBe( initialPanelIndex );
        expect( [ initialPanelIndex - 1, accordion.getTotalPanels() - 1 ] ).toContain( finalPanelIndex );
    });
});