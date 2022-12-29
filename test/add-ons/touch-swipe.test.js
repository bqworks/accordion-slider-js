import AccordionSlider from '../../src/core/accordion-slider.js';
import TouchSwipe from '../../src/add-ons/touch-swipe/touch-swipe.js';
import { basicAccordion } from '../assets/html/html.js';

let accordion;

beforeAll( ()=> {
    document.body.innerHTML = basicAccordion;
});

describe( 'touch swipe add-on', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider', {
            addOns: [ TouchSwipe ],
            visiblePanels: 2
        });
    });

    test( 'should add the `as-grab` class name to the panels', () => {
        expect( accordion.panelsContainerEl.classList.contains( 'as-grab' ) ).toBe( true );
    });

    test( 'should add the `as-grabbing` class name to the panels on mouse down', () => {
        accordion.panelsContainerEl.dispatchEvent( new MouseEvent( 'mousedown' ) );

        expect( accordion.panelsContainerEl.classList.contains( 'as-grabbing' ) ).toBe( true );
    });

    test( 'should add the `as-swiping` class name to the accordion on mouse move', () => {
        accordion.panelsContainerEl.dispatchEvent( new MouseEvent( 'mousemove' ) );

        expect( accordion.accordionEl.classList.contains( 'as-swiping' ) ).toBe( true );
    });

    test( 'should remove the `as-swiping` class on mouse up', () => {
        jest.useFakeTimers();
        document.dispatchEvent( new MouseEvent( 'mouseup' ) );
        jest.runAllTimers();

        expect( accordion.accordionEl.classList.contains( 'as-swiping' ) ).toBe( false );

        jest.useRealTimers();
    });
});