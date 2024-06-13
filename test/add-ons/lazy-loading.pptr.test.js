describe( 'lazy-loading add-on', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1024, height: 768 } );
        await page.goto( global.BASE_URL + 'lazy-loading.html');
    });

    test( 'should have the images loaded only in the visible panels', async () => {
        const imagesSources = await page.$$eval( '.as-background', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource, index ) => {
            if ( index === 0 || index === 1 || index === 2 ) {
                expect( imageSource.indexOf( 'default' ) ).not.toBe( -1 );
            } else {
                expect( imageSource.indexOf( 'blank' ) ).not.toBe( -1 );
            }
        });
    });

    test( 'should load the images in the new panels after navigating to a new page', async () => {
        await page.click( '.as-pagination-button:nth-child(2)' );

        await await new Promise((resolve) => { 
        setTimeout(resolve, 100);
    });

        const imagesSources = await page.$$eval( '.as-background', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource, index ) => {
            if ( index === 3 || index === 4 || index === 5 ) {
                expect( imageSource.indexOf( 'default' ) ).not.toBe( -1 );
            }
        });
    });
});