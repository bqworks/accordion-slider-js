import AccordionSlider from '../../src/core/accordion-slider.js';
import Autoplay from '../../src/add-ons/autoplay/autoplay.js';
import { basicAccordion } from '../assets/html/html.js';

let accordion;

beforeAll( ()=> {
    document.body.innerHTML = basicAccordion;
    jest.useFakeTimers();
});

afterAll( () => {
    jest.useRealTimers();
});

describe( 'autoplay add-on setup', () => {
    test( 'should automatically navigate to the next panel', () => {
        accordion = new AccordionSlider( '.accordion-slider', {
            addOns: [ Autoplay ],
            autoplay: true
        });

        accordion.addOns[ 'Autoplay' ].panelOpenCompleteHandler = jest.fn();

        const initialPanelIndex = accordion.getCurrentIndex();

        jest.runAllTimers();

        const finalPanelIndex = accordion.getCurrentIndex();

        expect( finalPanelIndex ).not.toBe( initialPanelIndex );
        expect( [ initialPanelIndex + 1, 0 ] ).toContain( finalPanelIndex );

        accordion.destroy();
    });

    test( 'should automatically navigate to the previous slide', () => {
        accordion = new AccordionSlider( '.accordion-slider', {
            addOns: [ Autoplay ],
            autoplay: true,
            autoplayDirection: 'backwards'
        });

        accordion.addOns[ 'Autoplay' ].panelOpenCompleteHandler = jest.fn();

        const initialPanelIndex = accordion.getCurrentIndex();

        jest.runAllTimers();

        const finalPanelIndex = accordion.getCurrentIndex();

        expect( finalPanelIndex ).not.toBe( initialPanelIndex );
        expect( [ initialPanelIndex - 1, accordion.getTotalPanels() - 1 ] ).toContain( finalPanelIndex );

        accordion.destroy();
    });
});

describe( 'autoplay on mouse interaction', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider', {
            addOns: [ Autoplay ],
            autoplay: true
        });

        accordion.addOns[ 'Autoplay' ].panelOpenCompleteHandler = jest.fn();
    });

    afterAll( () => {
        accordion.destroy();
    });

    test( 'should pause autoplay on hover', () => {
        const initialPanelIndex = accordion.getCurrentIndex();

        accordion.accordionEl.dispatchEvent( new MouseEvent( 'mouseenter' ) );
        jest.runAllTimers();

        const finalPanelIndex = accordion.getCurrentIndex();

        expect( finalPanelIndex ).toBe( initialPanelIndex );
    });

    test( 'should play autoplay on mouse leave', () => {
        const initialPanelIndex = accordion.getCurrentIndex();

        accordion.accordionEl.dispatchEvent( new MouseEvent( 'mouseleave' ) );
        jest.runAllTimers();

        const finalPanelIndex = accordion.getCurrentIndex();

        expect( finalPanelIndex ).not.toBe( initialPanelIndex );
    });
});