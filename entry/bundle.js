import AccordionSlider from '../src/core/accordion-slider.js';

import Autoplay from '../src/add-ons/autoplay/autoplay.js';
import Breakpoints from '../src/add-ons/breakpoints/breakpoints.js';
import Buttons from '../src/add-ons/buttons/buttons.js';
import DeepLinking from '../src/add-ons/deep-linking/deep-linking.js';
import Keyboard from '../src/add-ons/keyboard/keyboard.js';
import Layers from '../src/add-ons/layers/layers.js';
import LazyLoading from '../src/add-ons/lazy-loading/lazy-loading.js';
import Retina from '../src/add-ons/retina/retina.js';
import TouchSwipe from '../src/add-ons/touch-swipe/touch-swipe.js';
import SwapBackground from '../src/add-ons/swap-background/swap-background.js';
import MouseWheel from '../src/add-ons/mouse-wheel/mouse-wheel.js';
import Video from '../src/add-ons/video/video.js';

import AddOnsManager from '../src/add-ons/add-ons-manager.js';

AddOnsManager.add([ 
    Autoplay,
    Breakpoints,
    Buttons,
    DeepLinking,
    Keyboard,
    Layers,
    LazyLoading,
    Retina,
    TouchSwipe,
    SwapBackground,
    MouseWheel,
    Video
]);

window.AccordionSlider = AccordionSlider;