describe( 'example 3', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1200, height: 900 } );
        await page.goto( global.E2E_BASE_URL + 'example3.html' );
        await page.addStyleTag( { content: 'body { margin: 0 }' } );
    });

    test( 'should have the correct number of pagination buttons', async () => {
        const totalPanels = await page.$eval( '.accordion-slider', accordionEl => accordionEl.getElementsByClassName( 'as-panel' ).length );
        const visiblePanels = 7;
        const totalPaginationButtons = await page.$eval( '.as-pagination-buttons', buttonsEl => buttonsEl.getElementsByClassName( 'as-pagination-button' ).length );

        expect( totalPaginationButtons ).toBe( Math.ceil( totalPanels / visiblePanels ) );
    });

    test( 'should have the images loaded only in the visible panels', async () => {
        const imagesSources = await page.$$eval( '.as-background', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource, index ) => {
            if ( index >= 0 && index < 7 ) {
                expect( imageSource.indexOf( 'blank.gif' ) ).toBe( -1 );
            } else {
                expect( imageSource.indexOf( 'blank.gif' ) ).not.toBe( -1 );
            }
        });
    });

    test( 'should load the lazy loaded image when navigating to the next page', async () => {
        await page.click( '.as-pagination-button:nth-child(2)' );

        await await new Promise((resolve) => { 
        setTimeout(resolve, 100);
    });

        const imagesSources = await page.$$eval( '.as-background', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource, index ) => {
            if ( index >= 7 && index < 14 ) {
                expect( imageSource.indexOf( 'blank.gif' ) ).toBe( -1 );
            }
        });
    });

    test( 'should navigate to the next page using touch swipe', async () => {
        await page.mouse.move( 200, 100 );
        await page.mouse.down();
        await page.mouse.move( 100, 100, { steps: 20 } );
        await page.mouse.up();
        await await new Promise((resolve) => { 
        setTimeout(resolve, 1000);
    });

        const isButtonSelected = await page.$eval( '.as-pagination-button:nth-child(3)', buttonEl => buttonEl.classList.contains( 'as-selected' ) );

        expect( isButtonSelected ).toBe( true );
    });

    test( 'should apply the corresponding breakpoint settings when the page scales down', async () => {
        await page.setViewport( { width: 700, height: 400 } );
        await await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        const totalPanels = await page.$eval( '.accordion-slider', accordionEl => accordionEl.getElementsByClassName( 'as-panel' ).length );
        const visiblePanels = 3;
        const totalPaginationButtons = await page.$eval( '.as-pagination-buttons', buttonsEl => buttonsEl.getElementsByClassName( 'as-pagination-button' ).length );

        expect( totalPaginationButtons ).toBe( Math.ceil( totalPanels / visiblePanels ) );

        const isVertical = await page.$eval( '.accordion-slider', accordionEl => accordionEl.classList.contains( 'as-vertical' ) );

        expect( isVertical ).toBe( true );

        const accordionSize = await page.$eval( '.accordion-slider', accordionEl => ( { width: accordionEl.clientWidth, height: accordionEl.clientHeight } ) );

        expect( accordionSize ).toEqual( { width: 600, height: 500 } );
    });

    test( 'should navigate backwards using touch swipe', async () => {
        const totalPages = await page.$eval( '.as-pagination-buttons', buttonsEl => buttonsEl.getElementsByClassName( 'as-pagination-button' ).length );

        for ( let i = totalPages; i > 1; i-- ) {
            await page.mouse.move( 200, 100 );
            await page.mouse.down();
            await page.mouse.move( 200, 200, { steps: 20 } );
            await page.mouse.up();
            await await new Promise((resolve) => { 
        setTimeout(resolve, 1000);
    });
        }

        const isButtonSelected = await page.$eval( '.as-pagination-button:nth-child(1)', buttonEl => buttonEl.classList.contains( 'as-selected' ) );

        expect( isButtonSelected ).toBe( true );
    });

    test( 'should apply the correct breakpoint settings when the page resizes', async () => {
        await page.setViewport( { width: 600, height: 400 } );
        await await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        const totalPanels = await page.$eval( '.accordion-slider', accordionEl => accordionEl.getElementsByClassName( 'as-panel' ).length );
        const visiblePanels = 4;
        const totalPaginationButtons = await page.$eval( '.as-pagination-buttons', buttonsEl => buttonsEl.getElementsByClassName( 'as-pagination-button' ).length );

        expect( totalPaginationButtons ).toBe( Math.ceil( totalPanels / visiblePanels ) );

        const isHorizontal = await page.$eval( '.accordion-slider', accordionEl => accordionEl.classList.contains( 'as-horizontal' ) );

        expect( isHorizontal ).toBe( true );

        const accordionWidth = await page.$eval( '.accordion-slider', accordionEl => accordionEl.clientWidth );
        const resizedCorrectly = accordionWidth <= 600 && accordionWidth > 590;

        expect( resizedCorrectly ).toBe( true );
    });
});