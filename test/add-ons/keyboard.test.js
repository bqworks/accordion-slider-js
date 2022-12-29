import AccordionSlider from '../../src/core/accordion-slider.js';
import Keyboard from '../../src/add-ons/keyboard/keyboard.js';
import { keyboardAccordion } from '../assets/html/html.js';

let accordion;

beforeAll( ()=> {
    document.body.innerHTML = keyboardAccordion;
});

describe( 'keyboard add-on', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider', {
            addOns: [ Keyboard ]
        });
    });

    test( 'should navigate to the next panel upon right key press', () => {
        const initialPanelIndex = accordion.getCurrentIndex();

        document.dispatchEvent( new KeyboardEvent( 'keydown', { which: 39 } ) );

        const finalPanelIndex = accordion.getCurrentIndex();

        expect( finalPanelIndex ).not.toBe( initialPanelIndex );
        expect( [ initialPanelIndex + 1, 0 ] ).toContain( finalPanelIndex );
    });

    test( 'should navigate to the previous panel upon left key press', () => {
        const initialPanelIndex = accordion.getCurrentIndex();

        document.dispatchEvent( new KeyboardEvent( 'keydown', { which: 37 } ) );

        const finalPanelIndex = accordion.getCurrentIndex();

        expect( finalPanelIndex ).not.toBe( initialPanelIndex );
        expect( [ initialPanelIndex - 1, accordion.getTotalPanels() - 1 ] ).toContain( finalPanelIndex );
    });

    test( 'should open existing link upon enter key press', () => {
        const linkClickHandler = jest.fn();

        Array.from( accordion.accordionEl.querySelectorAll( '.as-panel > a' ) ).forEach( linkEl => {
            linkEl.addEventListener( 'click', linkClickHandler );
        });

        document.dispatchEvent( new KeyboardEvent( 'keydown', { which: 13 } ) );

        expect( linkClickHandler ).toHaveBeenCalled();
    });
});