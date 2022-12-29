import AccordionSlider from '../../src/core/accordion-slider.js';
import WindowResizeHandler from '../../src/helpers/window-resize-handler.js';
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

    test( 'should dispatch the `panelOpen` event type when `openPanel` is called', ( done ) => {
        expect.assertions( 2 );

        accordion.addEventListener( 'panelOpen', ( event ) => {
            expect( event.type ).toBe( 'panelOpen' );
            expect( event.detail.index ).toBe( 1 );
            done();
        });

        accordion.openPanel( 1 );
    });
});

describe( 'window resize', () => {
    test( 'should dispatch `resize` events at a frequency based on the specified delay allowance', ( done ) => {
        expect.assertions( 1 );

        const resizeDelay = 200;
        const windowResizeHandler = new WindowResizeHandler( resizeDelay );
        
        const timerLimit = 30;
        const timerSpeed = 15;

        let dispatchCounter = 0;
        let timerCounter = 0;

        windowResizeHandler.addEventListener( 'resize', () => {
            dispatchCounter++;
        });

        const timer = setInterval( () => {
            if ( timerCounter >= timerLimit ) {
                clearInterval( timer );

                if ( resizeDelay <= timerSpeed ) {
                    expect( dispatchCounter ).toBe( timerCounter );
                } else {
                    expect( dispatchCounter ).toBe( Math.floor( timerCounter * timerSpeed / resizeDelay ) );
                }

                done();
            }

            timerCounter++;

            window.resizeTo( 500 + timerCounter, 500 + timerCounter );
        }, timerSpeed );
    });
});
