import AccordionSlider from '../../src/core/accordion-slider.js';
import { basicAccordion } from '../assets/html/html.js';

let accordion;

beforeAll( ()=> {
    document.body.innerHTML = basicAccordion;
});

describe( 'accordion navigation', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider' );
    });

    afterAll( () => {
        accordion.destroy();
    });

    test( 'should increment the value of the selected panel index when calling `nextPanel', () => {
        let counter = accordion.getTotalPanels() * 2;

        while ( counter-- > 0 ) {
            const initialPanelIndex = accordion.getCurrentIndex();
            accordion.nextPanel();
            const finalPanelIndex = accordion.getCurrentIndex();

            expect( [ initialPanelIndex + 1, 0 ] ).toContain( finalPanelIndex );
        }
    });

    test( 'should decrement the value of the selected panel index when calling `previousPanel', () => {
        let counter = accordion.getTotalPanels() * 2;

        while ( counter-- > 0 ) {
            const initialPanelIndex = accordion.getCurrentIndex();
            accordion.previousPanel();
            const finalPanelIndex = accordion.getCurrentIndex();

            expect( [ initialPanelIndex - 1, accordion.getTotalPanels() - 1 ] ).toContain( finalPanelIndex );
        }
    });
});