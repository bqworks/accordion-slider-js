describe( 'touch swipe add-on (puppeteer)', () => {
    beforeAll( async () => {
        await page.goto( global.BASE_URL + 'touch-swipe.html' );
        await page.setViewport( { width: 1024, height: 768 } );
    });

    test( 'should navigate to the correct page on mouse drag', async () => {
        await page.waitForTimeout( 1000 );

        await page.mouse.move( 300, 300 );
        await page.mouse.down();
        await page.mouse.move( 200, 300 );
        await page.mouse.up();

        let isButtonSelected = await page.$eval( '.as-pagination-button:nth-child(2)', buttonEl => buttonEl.classList.contains( 'as-selected' ) );

        expect( isButtonSelected ).toBe( true );

        await page.waitForTimeout( 1000 );

        await page.mouse.move( 300, 300 );
        await page.mouse.down();
        await page.mouse.move( 400, 300 );
        await page.mouse.up();

        isButtonSelected = await page.$eval( '.as-pagination-button:nth-child(1)', buttonEl => buttonEl.classList.contains( 'as-selected' ) );

        expect( isButtonSelected ).toBe( true );
    });

    test( 'should not navigate to another panel if the mouse drag is below the threshold', async () => {
        await page.mouse.move( 300, 300 );
        await page.mouse.down();
        await page.mouse.move( 295, 300 );
        await page.mouse.up();

        let isButtonSelected = await page.$eval( '.as-pagination-button:nth-child(1)', buttonEl => buttonEl.classList.contains( 'as-selected' ) );

        expect( isButtonSelected ).toBe( true );
    });
});