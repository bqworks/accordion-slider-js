describe( 'example 4', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1200, height: 900 } );
        await page.goto( global.E2E_BASE_URL + 'example4.html' );
        await page.addStyleTag( { content: 'body { margin: 0 }' } );
    });

    test( 'should navigate through the panels using the arrow key ', async () => {
        const totalPanels = await page.$eval( '.accordion-slider', accordionEl => accordionEl.getElementsByClassName( 'as-panel' ).length );

        for ( let i = 0; i < totalPanels; i++ ) {
            await page.keyboard.press( 'ArrowRight' );
            await await new Promise((resolve) => { 
        setTimeout(resolve, 1000);
    });

            let isPanelOpened = await page.$eval( `.accordion-slider .as-panel:nth-child(${ i + 1 })`, panelEl => panelEl.classList.contains( 'as-opened' ) );
            expect( isPanelOpened ).toBe( true );
        }
    });

    test( 'should navigate backwards using the links', async () => {
        const totalPanels = await page.$eval( '.accordion-slider', accordionEl => accordionEl.getElementsByClassName( 'as-panel' ).length );

        for ( let i = totalPanels - 1; i >= 0; i-- ) {
            await page.click( `.controls a[href$="${ i }"]` );
            await await new Promise((resolve) => { 
        setTimeout(resolve, 1000);
    });

            let isPanelOpened = await page.$eval( `.accordion-slider .as-panel:nth-child(${ i + 1 })`, panelEl => panelEl.classList.contains( 'as-opened' ) );
            expect( isPanelOpened ).toBe( true );

            let hash = await page.evaluate( () => window.location.hash );
            expect( hash ).toBe( `#example4/${ i }` );
        }
    });

    test( 'should close the panels', async () => {
        await page.click( '.controls a[href="#"]' );
        await await new Promise((resolve) => { 
        setTimeout(resolve, 1000);
    });

        const isClosed = await page.$eval( '.accordion-slider', accordionEl => accordionEl.classList.contains( 'as-closed' ) );

        expect( isClosed ).toBe( true );
    });
});