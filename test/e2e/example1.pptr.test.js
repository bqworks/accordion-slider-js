describe( 'example 1', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1200, height: 900 } );
        await page.goto( global.E2E_BASE_URL + 'example1.html' );
        await page.addStyleTag( { content: 'body { margin: 0 } .accordion-slider { margin-left: 0 }' } );
    });

    test( 'should have the correct initial accordion slider', async () => {
        let accordionWidth = await page.$eval( '.accordion-slider', accordionEl => accordionEl.clientWidth );

        expect( accordionWidth ).toBe( 960 );
    });

    test( 'should navigate through all the slides upon keyboard arrow press', async () => {
        const totalPanels = await page.$eval( '.accordion-slider', accordionEl => accordionEl.getElementsByClassName( 'as-panel' ).length );

        for ( let i = 0; i < totalPanels; i++ ) {
            await page.keyboard.press( 'ArrowRight' );
            await page.waitForTimeout( 1000 );
        }

        const isLastPanelOpened = await page.$eval( `.as-panel:nth-child(${ totalPanels })`, panelEl => panelEl.classList.contains( 'as-opened' ) );

        expect( isLastPanelOpened ).toBe( true );
    });

    test( 'should resize the accordion slider when the viewport size is smaller than the accordion size', async () => {
        await page.setViewport( { width: 400, height: 300 } );
        await page.waitForTimeout( 500 );

        let accordionWidth = await page.$eval( '.accordion-slider', accordionEl => accordionEl.clientWidth );

        expect( accordionWidth ).toBe( 400 );
    });

    test ( 'should have the last pagination button selected', async () => {
        const isButtonSelected = await page.$eval( '.as-pagination-button:nth-child(3)', buttonEl => buttonEl.classList.contains( 'as-selected' ) );

        expect( isButtonSelected ).toBe( true );
    });

    test( 'should navigate backwards using mouse drag', async () => {
        const totalPages = await page.$eval( '.as-pagination-buttons', buttonsEl => buttonsEl.getElementsByClassName( 'as-pagination-button' ).length );

        for ( let i = 0; i < totalPages - 1; i++ ) {
            await page.mouse.move( 100, 100 );
            await page.mouse.down();
            await page.mouse.move( 200, 100, { steps: 20 } );
            await page.mouse.up();
            await page.waitForTimeout( 2000 );
        }

        const isButtonSelected = await page.$eval( '.as-pagination-button:nth-child(1)', buttonEl => buttonEl.classList.contains( 'as-selected' ) );

        expect( isButtonSelected ).toBe( true );
    });
});