import AccordionSlider from '../../src/core/accordion-slider.js';
import { basicAccordion } from '../assets/html/html.js';

let accordion, accordionEl;

beforeAll( ()=> {
    document.body.innerHTML = basicAccordion;
    accordionEl = document.getElementsByClassName( 'accordion-slider' )[0];
});

describe( 'accordion setup', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider' );
    });

    afterAll( () => {
        accordion.destroy();
    });

    test( 'should have the as-no-js class removed', () => {
        expect( accordionEl.classList.contains( 'as-no-js' ) ).toBe( false );
    });

    test( 'should have the correct number of panels', () => {
        expect( accordion.getTotalPanels() ).toBe( 5 );
    });

    test( 'should have the correct panel order', () => {
        const expectedPanelOrder = ['1', '2', '3', '4', '5'];
        const actualPanelOrder = [];

        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            actualPanelOrder.push( accordion.getPanelAt( i ).panelEl.textContent );
        }

        expect( actualPanelOrder ).toEqual( expectedPanelOrder );
    });

    test( 'should return the correct initial selected panel index', () => {
        expect( accordion.getCurrentIndex() ).toBe( -1 );
    });

    test( 'should return the correct panel when retrieving by index', () => {
        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            expect( accordion.getPanelAt( i ).index ).toBe( i );
        }
    });
});

describe( 'accordion shuffle', () => {
    beforeAll( () => {
        accordion = new AccordionSlider( '.accordion-slider', { shuffle: true } );
    });

    afterAll( () => {
        accordion.destroy();
    });

    test( 'should have random panel order when `shuffle` is used', () => {
        const notExpectedPanelOrder = ['1', '2', '3', '4', '5'];
        const randomPanelOrder = [];

        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            randomPanelOrder.push( accordion.getPanelAt( i ).panelEl.textContent );
        }

        expect( randomPanelOrder ).not.toEqual( notExpectedPanelOrder );
    });

    test( 'should have the correct number of panels when `shuffle` is used', () => {
        expect( accordion.getTotalPanels() ).toBe( 5 );
    });

    test( 'should have unique panels when `shuffle` is used', () => {
        const panels = ['1', '2', '3', '4', '5'];

        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            const index = panels.indexOf( accordion.getPanelAt( i ).panelEl.textContent );
            panels.splice( index, 1 );
        }

        expect( panels.length ).toBe( 0 );
    });
});

describe( 'update the accordion content', () => {
    beforeAll( () => {
        document.body.innerHTML = basicAccordion;
        accordionEl = document.getElementsByClassName( 'accordion-slider' )[0];
        accordion = new AccordionSlider( '.accordion-slider' );
    });

    afterAll( () => {
        accordion.destroy();
    });

    test( 'should add a panel at the correct position', () => {
        const newPanelEl = document.createElement( 'div' );
        newPanelEl.classList.add( 'as-panel' );
        newPanelEl.textContent = 'new panel';

        accordionEl.getElementsByClassName( 'as-panel' )[2].after( newPanelEl );

        accordion.update();

        const panelsContent = [];

        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            panelsContent.push( accordion.getPanelAt( i ).panelEl.textContent );
        }

        expect( panelsContent ).toEqual( ['1', '2', '3', 'new panel', '4', '5'] );
    });

    test( 'should add multiple panels at the correct position', () => {
        const secondPanelEl = document.createElement( 'div' );
        secondPanelEl.classList.add( 'as-panel' );
        secondPanelEl.textContent = 'second panel';

        const thirdPanelEl = document.createElement( 'div' );
        thirdPanelEl.classList.add( 'as-panel' );
        thirdPanelEl.textContent = 'third panel';

        accordionEl.getElementsByClassName( 'as-panel' )[1].after( secondPanelEl );
        accordionEl.getElementsByClassName( 'as-panel' )[5].after( thirdPanelEl );

        accordion.update();

        const panelsContent = [];

        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            panelsContent.push( accordion.getPanelAt( i ).panelEl.textContent );
        }

        expect( panelsContent ).toEqual( ['1', '2', 'second panel', '3', 'new panel', '4', 'third panel', '5'] );
    });

    test( 'should remove a panel', () => {
        const toRemovePanelEl = accordionEl.getElementsByClassName( 'as-panel' )[4];
        toRemovePanelEl.remove();

        accordion.update();

        const panelsContent = [];

        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            panelsContent.push( accordion.getPanelAt( i ).panelEl.textContent );
        }

        expect( panelsContent ).toEqual( ['1', '2', 'second panel', '3', '4', 'third panel', '5'] );
    });

    test( 'should remove multiple panels', () => {
        let toRemovePanelEl = accordionEl.getElementsByClassName( 'as-panel' )[4];
        toRemovePanelEl.remove();

        toRemovePanelEl = accordionEl.getElementsByClassName( 'as-panel' )[2];
        toRemovePanelEl.remove();

        toRemovePanelEl = accordionEl.getElementsByClassName( 'as-panel' )[4];
        toRemovePanelEl.remove();

        accordion.update();

        const panelsContent = [];

        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            panelsContent.push( accordion.getPanelAt( i ).panelEl.textContent );
        }

        expect( panelsContent ).toEqual( ['1', '2', '3', 'third panel'] );
    });

    test( 'should add and remove multiple panels', () => {
        let newPanelEl = document.createElement( 'div' );
        newPanelEl.classList.add( 'as-panel' );
        newPanelEl.textContent = '4';
        accordionEl.getElementsByClassName( 'as-panel' )[2].after( newPanelEl );

        newPanelEl = document.createElement( 'div' );
        newPanelEl.classList.add( 'as-panel' );
        newPanelEl.textContent = '5';
        accordionEl.getElementsByClassName( 'as-panel' )[3].after( newPanelEl );

        let toRemovePanelEl = accordionEl.getElementsByClassName( 'as-panel' )[5];
        toRemovePanelEl.remove();

        toRemovePanelEl = accordionEl.getElementsByClassName( 'as-panel' )[0];
        toRemovePanelEl.remove();

        accordion.update();

        const panelsContent = [];

        for ( let i = 0; i < accordion.getTotalPanels(); i++ ) {
            panelsContent.push( accordion.getPanelAt( i ).panelEl.textContent );
        }

        expect( panelsContent ).toEqual( ['2', '3', '4', '5'] );
    });
});