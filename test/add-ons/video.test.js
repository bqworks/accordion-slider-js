import AccordionSlider from '../../src/core/accordion-slider.js';
import Autoplay from '../../src/add-ons/autoplay/autoplay.js';
import Video from '../../src/add-ons/video/video.js';
import VideoController from '../../src/add-ons/video/video-controller.js';
import VideoPlayerMock from '../helpers/video-player-mock.js';
import VideoElementMock from '../helpers/video-element-mock.js';
import { videoAccordion } from '../assets/html/html.js';
import '../helpers/youtube-api-mock.js';
import '../helpers/vimeo-api-mock.js';

VideoController.addPlayer( VideoPlayerMock );

let accordion, accordionEl, videoEl, videoMock;

describe( 'video add-on', () => {
    describe( 'inline videos', () => {
        beforeAll( () => {
            document.body.innerHTML = videoAccordion;
            accordion = new AccordionSlider( '.accordion-slider', {
                addOns: [ Autoplay, Video ]
            });
            accordionEl = accordion.accordionEl;
            videoEl = accordionEl.getElementsByClassName( 'as-video' )[ 0 ];
            videoMock = new VideoElementMock( videoEl );
        });
    
        test( 'should initialize inline videos that have the `as-video` class', () => {
            Array.from( accordionEl.querySelectorAll( '.as-video:not(a)' ) ).forEach( videoEl => {
                expect( videoEl.getAttribute( 'data-video-init' ) ).not.toBe( null );
            });
        });
    
        test( 'should pre-initialize lazy-loaded videos that have the `as-video` class', () => {
            Array.from( accordionEl.querySelectorAll( 'a.as-video' ) ).forEach( videoEl => {
                expect( videoEl.getAttribute( 'data-video-preinit' ) ).not.toBe( null );
            });
        });
    
        test( 'should stop autoplay when the video starts playing', () => {
            accordion.settings.autoplay = true;
            accordion.settings.playVideoAction = 'stopAutoplay';
            accordion.update();
            accordion.openPanel( 0 );
    
            videoMock.play();
    
            expect( accordion.addOns['Autoplay'].settings.autoplay ).toBe( false );
        });
    
        test( 'should resume autoplay when the video is paused', () => {
            accordion.settings.autoplay = true;
            accordion.settings.pauseVideoAction = 'startAutoplay';
            accordion.addOns['Autoplay'].settings.autoplay = false;
            accordion.update();
            accordion.openPanel( 0 );
    
            videoMock.pause();
    
            expect( accordion.addOns['Autoplay'].settings.autoplay ).toBe( true );
        });
    
        test( 'should resume autoplay when the video ends', () => {
            accordion.settings.endVideoAction = 'startAutoplay';
            accordion.addOns['Autoplay'].settings.autoplay = false;
            accordion.update();
            accordion.openPanel( 0 );
    
            videoMock.end();
    
            expect( accordion.addOns['Autoplay'].settings.autoplay ).toBe( true );
        });
    
        test( 'should navigate to the next panel when the video ends', () => {
            accordion.settings.endVideoAction = 'nextPanel';
            accordion.update();
            accordion.openPanel( 0 );
    
            videoMock.end();
    
            expect( accordion.getCurrentIndex() ).toBe( 1 );
        });
    
        test( 'should replay the video when the video ends', () => {
            accordion.settings.endVideoAction = 'replayVideo';
            accordion.update();
            accordion.openPanel( 0 );
    
            const mockPlayHandler = jest.fn();
            videoMock.addEventListener( 'play', mockPlayHandler );
    
            videoMock.end();
    
            expect( mockPlayHandler ).toHaveBeenCalled();
        });
    
        test( 'should stop the video when the accordion navigates to a new panel', () => {
            accordion.settings.closePanelVideoAction = 'stopVideo';
            accordion.update();
            accordion.openPanel( 0 );
    
            const mockStopHandler = jest.fn();
            videoMock.addEventListener( 'pause', mockStopHandler );
    
            accordion.nextPanel();
    
            expect( mockStopHandler ).toHaveBeenCalled();
        });
    
        test( 'should pause the video when the accordion navigates to a new panel', () => {
            accordion.settings.closePanelVideoAction = 'pauseVideo';
            accordion.update();
            accordion.openPanel( 0 );
    
            const mockPauseHandler = jest.fn();
            videoMock.addEventListener( 'pause', mockPauseHandler );
    
            accordion.nextPanel();
    
            expect( mockPauseHandler ).toHaveBeenCalled();
        });

        test( 'should stop the inline video when the accordion navigates to a new panel', () => {
            accordion.openPanel( 0 );
            accordion.settings.closePanelVideoAction = 'removeVideo';
            accordion.update();
    
            const mockStopHandler = jest.fn();
            videoMock.addEventListener( 'pause', mockStopHandler );
    
            accordion.nextPanel();
    
            expect( mockStopHandler ).toHaveBeenCalled();
        });

        test( 'should destroy videos when the accordion is destroyed', () => {
            accordion.destroy();

            expect( accordion.accordionEl.querySelectorAll( '.as-video[data-video-init]' ).length ).toBe( 0 );
            expect( accordion.accordionEl.querySelectorAll( '.as-video[data-video-preinit]' ).length ).toBe( 0 );
        });
    });

    describe( 'lazy loaded videos', () => {
        beforeAll( () => {
            document.body.innerHTML = videoAccordion;
            accordion = new AccordionSlider( '.accordion-slider', {
                addOns: [ Video ]
            });
            accordionEl = accordion.accordionEl;
        });

        test( 'should initialize lazy loaded youtube videos on video click', () => {
            accordion.openPanel( 2 );

            const panelEl = accordion.getPanelAt( accordion.getCurrentIndex() ).panelEl;
            const lazyVideoEl = panelEl.getElementsByClassName( 'as-video' )[ 0 ];
            lazyVideoEl.dispatchEvent( new MouseEvent( 'click' ) );

            expect( panelEl.innerHTML.indexOf( 'iframe' ) !== 0 ).toBe( true );
        });

        test( 'should initialize lazy loaded vimeo videos on video click', () => {
            accordion.openPanel( 3 );

            const panelEl = accordion.getPanelAt( accordion.getCurrentIndex() ).panelEl;
            const lazyVideoEl = panelEl.getElementsByClassName( 'as-video' )[ 0 ];
            lazyVideoEl.dispatchEvent( new MouseEvent( 'click' ) );

            expect( panelEl.innerHTML.indexOf( 'iframe' ) !== 0 ).toBe( true );
        });

        test( 'should remove the lazy loaded video when the slider navigates to a new slide', () => {
            accordion.openPanel( 3 );

            accordion.settings.closePanelVideoAction = 'removeVideo';
            accordion.update();

            let videoEl = accordion.getPanelAt( 3 ).panelEl.querySelector( '.as-video[data-video-init]' );

            expect( videoEl ).not.toBe( null );

            accordion.nextPanel();

            videoEl = accordion.getPanelAt( 3 ).panelEl.querySelector( '.as-video[data-video-init]' );

            expect( videoEl ).toBe( null );
        });

        test( 'should destroy videos when the accordion is destroyed', () => {
            accordion.destroy();

            expect( accordion.accordionEl.querySelectorAll( '.as-video[data-video-init]' ).length ).toBe( 0 );
            expect( accordion.accordionEl.querySelectorAll( '.as-video[data-video-preinit]' ).length ).toBe( 0 );
        });
    });
});
