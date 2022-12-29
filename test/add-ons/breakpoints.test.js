import AccordionSlider from '../../src/core/accordion-slider.js';
import Breakpoints from '../../src/add-ons/breakpoints/breakpoints.js';
import { basicAccordion } from '../assets/html/html.js';

let accordion;

beforeAll( ()=> {
    document.body.innerHTML = basicAccordion;
});

describe( 'breakpoints add-on', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider', {
            width: 800,
            height: 500,
            addOns: [ Breakpoints ],
            breakpoints: {
                700: {
                    orientation: 'vertical',
                    width: 500,
                    height: 300
                },
                500: {
                    orientation: 'horizontal',
                    width: 300,
                    height: 200
                }
            }
        });

        jest.useFakeTimers();
    });

    afterAll( () => {
        jest.useRealTimers();
    });

    test( 'should apply the corresponding breakpoint when the window resizes', () => {
        window.resizeTo( 600, 500 );

        jest.runAllTimers();

        expect( accordion.settings.width ).toBe( 500 );
        expect( accordion.settings.height ).toBe( 300 );
        expect( accordion.settings.orientation ).toBe( 'vertical' );

        window.resizeTo( 400, 300 );

        jest.runAllTimers();

        expect( accordion.settings.width ).toBe( 300 );
        expect( accordion.settings.height ).toBe( 200 );
        expect( accordion.settings.orientation ).toBe( 'horizontal' );
    });
});