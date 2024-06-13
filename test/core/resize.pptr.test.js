describe( 'accordion resizing', () => {
    beforeAll( async () => {
        await page.goto( global.BASE_URL + 'resize.html');
    });

    test( 'should resize the accordion when the viewport scales down', async () => {
        await page.setViewport( { width: 900, height: 700 } );
        await await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        let accordionWidth = await page.$eval( '#responsive-accordion', accordionEl => accordionEl.clientWidth );

        expect( accordionWidth ).toBe( 800 );

        await page.setViewport( { width: 500, height: 300 } );
        await await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        accordionWidth = await page.$eval( '#responsive-accordion', accordionEl => accordionEl.clientWidth );

        expect( accordionWidth ).toBe( 500 );
    });

    test( 'should not resize the non-responsive accordion when the viewport scales down', async () => {
        await page.setViewport( { width: 400, height: 300 } );
        await await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        const accordionWidth = await page.$eval( '#non-responsive-accordion', accordionEl => accordionEl.clientWidth );

        expect( accordionWidth ).toBe( 800 );
    });

    test( 'should scale down automatically the content of the accordion when the viewport scales down', async () => {
        await page.setViewport( { width: 400, height: 300 } );
        await await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        const accordionScale = await page.$eval( '#auto-responsive-accordion', accordionEl => accordionEl.getElementsByClassName( 'as-mask' )[0].style.transform );

        expect( accordionScale ).toBe( 'scaleX(0.5) scaleY(0.5)' );
    });

    test( 'should not scale down automatically the content of the accordion when responsiveMode is set to custom and the viewport scales down', async () => {
        await page.setViewport( { width: 400, height: 300 } );
        await await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        const accordionScale = await page.$eval( '#custom-responsive-accordion', accordionEl => accordionEl.getElementsByClassName( 'as-mask' )[0].style.transform );

        expect( accordionScale ).toBe( '' );
    });
});