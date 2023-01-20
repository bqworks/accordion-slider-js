[![npm version](https://img.shields.io/npm/v/accordion-slider-js)](https://www.npmjs.com/package/accordion-slider-js)
[![License](https://img.shields.io/github/license/bqworks/accordion-slider-js)](https://github.com/bqworks/accordion-slider-js/blob/master/LICENSE)
[![Build](https://github.com/bqworks/accordion-slider-js/actions/workflows/build.yml/badge.svg)](https://github.com/bqworks/accordion-slider-js/actions/workflows/build.yml)
[![Tests](https://github.com/bqworks/accordion-slider-js/actions/workflows/test.yml/badge.svg)](https://github.com/bqworks/accordion-slider-js/actions/workflows/test.yml)
[![Downloads](https://img.shields.io/npm/dt/accordion-slider-js)](https://github.com/bqworks/accordion-slider-js)

# Accordion Slider JS #

A JavaScript accordion slider that is __modular__, __dependency-free__, __rich-featured__, __flexible__ and __easy to use__. 

*Main features:* 

* Modular architecture
* Responsive
* Touch-swipe support
* CSS3 transitions
* Animated layers (and static)
* Deep-linking
* Lazy loading support
* Video content support
* JavaScript breakpoints 

See some [examples](https://bqworks.net/accordion-slider/) on the [presentation page](https://bqworks.net/accordion-slider/).

The Accordion Slider is also available as a [jQuery plugin](https://github.com/bqworks/accordion-slider-jquery) and as a [WordPress plugin](https://wordpress.org/plugins/accordion-slider/).

## Getting started ##

### 1. Get a copy of the plugin ###

You can fork or download the plugin from GitHub, or you can install it through `npm`.

```
$ npm install accordion-slider-js
```

### 2. Load the required files ###

You can either load the minimized JS and CSS files in your HTML or you can import the files as modules.

```html
<link rel="stylesheet" href="accordion-slider-js/build/accordion-slider.css"/>
<script type="text/javascript" src="accordion-slider-js/build/accordion-slider.js"></script>
```

From unpkg.com:

```html
<link rel="stylesheet" href="https://unpkg.com/accordion-slider-js/build/accordion-slider.css"/>
<script type="text/javascript" src="https://unpkg.com/accordion-slider-js/build/accordion-slider.js"></script>
```

Alternatively you can import the accordion's core and each add-on from the `accordion-slider-js` package.

```js
import AccordionSlider, { Autoplay, Buttons, SwapBackground } from 'accordion-slider-js';
```

You can also import the CSS, either the entire code or for each individual module:

```js
// imports the entire CSS code
import 'accordion-slider-js/css';
```

```js
// imports the CSS code for the core and for each individual add-on
import 'accordion-slider-js/css/core';
import 'accordion-slider-js/css/buttons';
import 'accordion-slider-js/css/layers';
import 'accordion-slider-js/css/touch-swipe';
import 'accordion-slider-js/css/video';
```

### 3. Create the HTML for the accordion slider ###

```html
<div class="accordion-slider" id="my-accordion">
	<div class="as-panels">
		<!-- Panel 1 -->
		<div class="as-panel">
			<img class="as-background" src="path/to/image1.jpg"/>
		</div>
		
		<!-- Panel 2 -->
		<div class="as-panel">
			<p>Lorem ipsum dolor sit amet</p>
		</div>
		
		<!-- Panel 3 -->
		<div class="as-panel">
			<h3 class="as-layer">Lorem ipsum dolor sit amet</h3>
			<p class="as-layer">consectetur adipisicing elit</p>
		</div>
	</div>
</div>
```

### 4. Instantiate the accordion slider ###

```html
<script type="text/javascript">
	document.addEventListener( 'DOMContentLoaded', () => {
		const mySlider = new AccordionSlider( '#my-accordion', {
			width: '100vw',
			height: '100vh',
			autoplay: true,
			...
		});
	});
</script>
```

If you are importing the files as modules, you need to add each imported add-on to the `addOns` option.

```html
<script type="text/javascript">
	document.addEventListener( 'DOMContentLoaded', () => {
		const mySlider = new AccordionSlider( '#my-accordion', {
			addOns: [ Autoplay, Buttons ],
			width: '100vw',
			...
		});
	});
</script>
```

### Custom build ###

The files from the packages's `build` folder, by default, will include all the accordion's features. If you will use only a few of the provided features/add-ons and you want to optimize the files so that they include only what you use, you need to go to `entry/bundle.js` and `entry/style-bundle.js`, and comment out/remove the add-ons that you won't use. After that you need to open the terminal, navigate to the `accordion-slider-js` package and run `npm run build`. 

## Detailed usage instructions ##

* [JavaScript API](#1-core-options)
	* [1. Core options](#1-core-options)
	* [2. Add-on options](#2-add-on-options)
	* [3. Public Methods](#3-public-methods)
	* [4. Events](#4-events)
* [Add-ons](#add-ons)
	* [1. Breakpoints](#1-breakpoints)
	* [2. Swap Background](#2-swap-background)
	* [3. Lazy Loading](#3-lazy-loading)
	* [4. Retina](#4-retina)
	* [5. Layers](#5-layers)
	* [6. Deep Linking](#6-deep-linking)
	* [7. Autoplay](#7-autoplay)
	* [8. Touch Swipe](#8-touch-swipe)
	* [9. Buttons](#9-buttons)
	* [10. Keyboard](#10-keyboard)
	* [11. Mouse Wheel](#11-mouse-wheel)
	* [12. Video](#12-video)

### 1. Core options ###

Name | Default value | Description
---|---|---
width | 800 | Sets the width of the accordion. Can be set to a fixed value, like 900 (indicating 900 pixels), or to a percentage value, like '100%'. It's important to note that percentage values need to be specified inside quotes. For fixed values, the quotes are not necessary.
height | 400 | Sets the height of the accordion. The same rules available for the 'width' property also apply for the 'height' property.
responsive | true | Makes the accordion responsive. The accordion can be responsive even if the 'width' and/or 'height' properties are set to fixed values. In this situation, 'width' and 'height' will act as the maximum width and height of the accordion.
responsiveMode | 'auto' | Sets the responsive mode of the accordion. Possible values are 'auto' and 'custom'. 'auto' resizes the accordion and all of its elements (e.g., layers, videos) automatically, while 'custom' resizes only the accordion container and panels, and you are given flexibility over the way inner elements (e.g., layers, videos) will respond to smaller sizes. For example, you could use CSS media queries to define different text sizes or to hide certain elements when the accordion becomes smaller, ensuring that all content remains readable without having to zoom in. It's important to note that, if 'auto' responsiveness is used, the 'width' and 'height' need to be set to fixed values, so that the accordion can calculate correctly how much it needs to scale.
aspectRatio | -1 | Sets the aspect ratio of the accordion. The accordion will set its height depending on what value its width has, so that this ratio is maintained. For this reason, the set 'height' might be overridden. This property can be used only when 'responsiveMode' is set to 'custom'. When it's set to 'auto', the 'aspectRatio' needs to remain -1.
orientation | 'horizontal' | Sets the orientation of the panels. Possible values are 'horizontal' and 'vertical'.
startPanel | -1 | Indicates which panel will be opened when the accordion loads (0 for the first panel, 1 for the second panel, etc.). If set to -1, no panel will be opened.
openedPanelSize | 'max' | Sets the size (width if the accordion's orientation is horizontal; height if the accordion's orientation is vertical) of the opened panel. Possible values are: 'max', which will open the panel to its maximum size, so that all the inner content is visible, a percentage value, like '50%', which indicates the percentage of the total size (width or height, depending on the orientation) of the accordion, or a fixed value.
maxOpenedPanelSize | '80%' | Sets the maximum allowed size of the opened panel. This should be used when the 'openedPanelSize' is set to 'max', because sometimes the maximum size of the panel might be too big and we want to set a limit. The property can be set to a percentage (of the total size of the accordion) or to a fixed value.
openPanelOn | 'hover' | If set to 'hover', the panels will be opened by moving the mouse pointer over them; if set to 'click', the panels will open when clicked. Can also be set to 'never' to disable the opening of the panels.
closePanelsOnMouseOut | true | Determines whether the opened panel closes or remains open when the mouse pointer is moved away.
mouseDelay | 200 | Sets the delay in milliseconds between the movement of the mouse pointer and the opening of the panel. Setting a delay ensures that panels are not opened if the mouse pointer only moves over them without an intent to open the panel.
panelDistance | 0 | Sets the distance between consecutive panels. Can be set to a percentage or fixed value.
openPanelDuration | 700 | Determines the duration in milliseconds for the opening of a panel.
closePanelDuration | 700 | Determines the duration in milliseconds for the closing of a panel.
pageScrollDuration | 500 | Indicates the duration of the page scroll.
visiblePanels | -1 | Indicates the number of panels visible per page. If set to -1, all the panels will be displayed on one page.
startPage | 0 | Indicates which page will be opened when the accordion loads, if the panels are displayed on more than one page.
shadow | true | Indicates if the panels will have a drop shadow effect.
panelOverlap | true | Indicates if the panels will be overlapped. If set to false, the panels will have their width or height set so that they are next to each other, but not overlapped.
shuffle | false | Indicates if the panels will be shuffled/randomized.

### 2. Add-on options ###

Name | Default value | Description
---|---|---
<span id="addons">addOns</span> | [] | If the add-ons are imported as modules, each module needs to be added to this array.
<span id="breakpoints">breakpoints</span> | null | Sets specific breakpoints which allow changing the look and behavior of the accordion when the page resizes.
<span id="autoplay">autoplay</span> | true | Indicates if the autoplay will be enabled.
<span id="autoplaydelay">autoplayDelay</span> | 5000 | Sets the delay, in milliseconds, of the autoplay cycle.
<span id="autoplaydirection">autoplayDirection</span> | 'normal' | Sets the direction in which the panels will be opened. Can be set to 'normal' (ascending order) or 'backwards' (descending order).
<span id="autoplayonhover">autoplayOnHover</span> | 'pause' | Indicates if the autoplay will be paused or stopped when the accordion is hovered. Can be set to 'pause', 'stop' or 'none'.
<span id="mousewheel">mouseWheel</span> | true | Indicates if the accordion will respond to mouse wheel input.
<span id="mousewheelsensitivity">mouseWheelSensitivity</span> | 50 | Sets how sensitive the accordion will be to mouse wheel input. Lower values indicate stronger sensitivity.
<span id="mousewheeltarget">mouseWheelTarget</span> | 'panel' | Sets what elements will be targeted by the mouse wheel input. Can be set to 'panel' or 'page'. Setting it to 'panel' will indicate that the panels will be scrolled, while setting it to 'page' indicate that the pages will be scrolled.
<span id="keyboard">keyboard</span> | true | Indicates if the accordion will respond to keyboard input.
<span id="keyboardonlyonfocus">keyboardOnlyOnFocus</span> | false | Indicates if the accordion will respond to keyboard input only if the accordion has focus.
<span id="keyboardtarget">keyboardTarget</span> | 'panel' | Sets what elements will be targeted by the keyboard input. Can be set to 'panel' or 'page'. Setting it to 'panel' will indicate that the panels will be scrolled, while setting it to 'page' indicate that the pages will be scrolled.
<span id="buttons">buttons</span> | true | Enables button controls below the accordion.
<span id="swapbackgroundduration">swapBackgroundDuration</span> | 700 | Sets the duration, in milliseconds, of the transition effect.
<span id="fadeoutbackground">fadeOutBackground</span> | false | Indicates if the main image background will be faded out when the opened/alternative background fades in.
<span id="touchswipe">touchSwipe</span> | true | Indicates if the touch swipe functionality will be enabled.
<span id="touchswipethreshold">touchSwipeThreshold</span> | 50 | Sets how many pixels the distance of the swipe gesture needs to be in order to trigger a page change.
<span id="openpanelvideoaction">openPanelVideoAction</span> | 'playVideo' | Sets what the video will do when the panel is opened. Can be set to 'playVideo' or 'none'.
<span id="closepanelvideoaction">closePanelVideoAction</span> | 'pauseVideo' | Sets what the video will do when the panel is closed. Can be set to 'pauseVideo' or 'stopVideo.'
<span id="playvideoaction">playVideoAction</span> | 'stopAutoplay' | Sets what the accordion will do when a video starts playing. Can be set to 'stopAutoplay' or 'none'.
<span id="pausevideoaction">pauseVideoAction</span> | 'none' | Sets what the accordion will do when a video is paused. Can be set to 'startAutoplay' or 'none'.
<span id="endvideoaction">endVideoAction</span> | 'none' | Sets what the accordion will do when a video ends. Can be set to 'startAutoplay', 'nextPanel', 'replayVideo' or 'none'.

### 3. Public methods ###

Method signature | Description
---|---
getPanelAt( index ) | Gets all the data of the panel at the specified index. Returns an object that contains all the data specified for that panel.
getCurrentIndex() | Gets the index of the current panel.
getTotalPanels() | Gets the total number of panels.
nextPanel() | Opens the next panel.
previousPanel() | Opens the previous panel.
openPanel( index ) | Opens the panel at the specified index.
closePanels() | Closes all the panels.
getVisiblePanels() | Gets the number of visible panels.
getTotalPages() | Gets the number of pages.
getCurrentPage() | Gets the index of the page currently displayed.
gotoPage( index ) | Scrolls to the specified page.
nextPage() | Goes to the next page.
previousPage() | Goes to the previous page.
addEventListener( type, handler ) | Adds an event listener to the accordion.
removeEventListener( type ) | Removes an event listener from the accordion.
destroy() | Destroys an accordion by removing all the visual elements and functionality added by the plugin. Basically, it leaves the accordion in the state it was before the plugin was instantiated.
update() | This is called by the plugin automatically when a property is changed. You can call this manually in order to refresh the accordion after changing its HTML, like removing or adding panels.
resize() | This is called by the plugin automatically, when the browser window is resized. You can also call it manually if you find it necessary to have the accordion resize itself.

*Example:*

```javascript
// instantiate the accordion and set a few options
const myAccordion = new AccordionSlider( '#my-accordion', {
	visiblePanels: 3,
	orientation: 'vertical'
});

// the accordion will open the next panel when the document is clicked
document.addEventListener( 'click', () => {
	myAccordion.nextPanel();
});
```

### 4. Events ###

Event type | Description
---|---
beforeInit | Triggered before the accordion begins its initialization.
init | Triggered after the accordion was setup.
beforeUpdate | Triggered before the accordion is updates.
update | Triggered when the 'update' method is called, either automatically or manually.
beforeResize | Triggered before the accordion is resized.
resize | Triggered when the 'resize' method is called, either automatically or manually.
accordionMouseOver | Triggered when the mouse pointer moves over the accordion.
accordionMouseOut | Triggered when the mouse pointer leaves the accordion.
panelClick | Triggered when a panel is clicked.<br>Available details:<br>*index*: the index of the clicked panel
panelMouseOver | Triggered when the mouse pointer moves over a panel. <br>Available details:<br>*index*: the index of the panel over which the mouse pointer has moved
panelMouseOut | Triggered when the mouse pointer leaves a panel. <br>Available details:<br>*index*: the index of panel from which the mouse pointer has moved away
panelOpen | Triggered when a panel is opened. <br>Available details:<br>*index*: the index of the opened panel<br/>*previousIndex*: the index of the previously opened panel
panelsClose | Triggered when the panels are closed. <br>Available details:<br>*previousIndex*: the index of the previously opened panel
pageScroll | Triggered when the accordion scrolls to another page. <br>Available details:<br>*index*: the index of the current page
panelOpenComplete | Triggered when the opening of a panel is completed. <br>Available details:<br>*index*: the index of the opened panel
panelsCloseComplete | Triggered when the closing of the panels is completed. <br>Available details:<br>*previousIndex*: the index of the previously opened panel
pageScrollComplete | Triggered when the scroll to a page is completed. <br>Available details:<br>*index*: the index of the current page

*Example:*

```javascript
// instantiate the accordion and set a few options
const myAccordion = new AccordionSlider( '#my-accordion', {
	visiblePanels: 3,
	orientation: 'vertical'
});

// the accordion will open the next panel when the document is clicked
document.addEventListener( 'click', () => {
	myAccordion.nextPanel();
});

myAccordion.addEventListener( 'panelOpen', ( event ) => {
	console.log( event.detail.index, event.detail.previousIndex );
});
```

## Add-ons ##

Add-ons are optional blocks of code that extend the core functionality, adding more capabilities. This modular architecture makes the code more organized and also allows you to include only the features you will use, resulting in an optimized file size and performance.

### 1. Breakpoints ###

The 'breakpoints' property is assigned an object which contains certain browser window widths and the accordion properties that are applied to those specific widths. This is very similar to CSS media queries. However, please note that these custom properties will not be inherited between different breakpoints. The accordion's properties will reset to the original values before applying a new set of properties, so if you want a certain property value to persist, you need to set it for each breakpoint.

*Example:*
```javascript
const myAccordion = new AccordionSlider( '#my-accordion', {
	width: 960, 
	height: 400,
	...
	breakpoints: {
		960: {visiblePanels: 5},
		800: {visiblePanels: 3, orientation: 'vertical', width: 600, height: 500},
		650: {visiblePanels: 4},
		500: {visiblePanels: 3, orientation: 'vertical', aspectRatio: 1.2}
	}
});
```

---

### 2. Swap Background ###

Allows you to set an alternative background image that will appear when the panel is opened. The alternative image must be added in a separate `img` element and it must be given the `as-background-opened` class.

```html
<div class="as-panel">
	<img class="as-background" src="path/to/image1.jpg"/>
	<img class="as-background-opened" src="path/to/alt_image1.jpg"/>
</div>

<div class="as-panel">
	<img class="as-background" src="path/to/blank.gif" data-src="path/to/image2.jpg" data-retina="path/to/image2@2x.jpg"/>
	<img class="as-background-opened" src="path/to/blank.gif" data-src="path/to/alt_image2.jpg" data-retina="path/to/alt_image2@2x.jpg"/>
</div>

<div class="as-panel">
	<img class="as-background" src="path/to/blank.gif" data-src="path/to/image3.jpg" data-retina="path/to/image3@2x.jpg"/>
	<a href="https://bqworks.net">
		<img class="as-background-opened" src="path/to/blank.gif" data-src="path/to/alt_image3.jpg" data-retina="path/to/alt_image3@2x.jpg"/>
	</a>
</div>
```

As you can see, the alternative image can be lazy loaded and can have a high resolution version as well.

Please note that the size of the 'opened' image should be equal or bigger than the size of the default image, in order to prevent parts of the default image to be visible behind the 'opened' image when the panel is opened.

This module is showcased in example2.html.

__Customizable properties:__ [fadeOutBackground](#fadeoutbackground), [swapBackgroundDuration](#swapbackgroundduration).

---

### 3. Lazy Loading ###

Enables the accordion to load images only when they are in view. It makes sense to use it when there are multiple pages in the accordion, so that images from other pages are not loaded until the user navigates to that page.

*Example:*

```html
<div class="as-panel">
	<img class="as-background" src="path/to/blank.gif" data-src="path/to/image1.jpg"/>
</div>

<div class="as-panel">
	<a href="https://bqworks.net">
		<img class="as-background" src="path/to/blank.gif" data-src="path/to/image2.jpg"/>
	</a>
</div>

<div class="as-panel">
	<img class="as-background" src="path/to/blank.gif" data-src="path/to/image3.jpg"/>
</div>
```

The `src` attribute of the image will point to a placeholder image, and the actual image will be specified in the `data-src` attribute. When the panel becomes visible, the placeholder image will be replaced by the actual image. You can use the placeholder image that comes with the accordion, or you can create your own placeholder image. The bundled placeholder image is located in dist/css/images/blank.gif and it's a 1 pixel by 1 pixel blank image.

This module is showcased in example1.html and example3.html.

---

### 4. Retina ###

Allows you to specify an alternative image for screens with high PPI (pixels per inch), like the 'Retina' screens from Apple devices. Please note that this module will work for any screen that has high PPI, not only for the 'Retina' screens.

The high resolution image needs to be specified in the `data-retina` attribute, as seen below:

```html
<div class="as-panel">
	<img class="as-background" src="path/to/image1.jpg" data-retina="path/to/image1@2x.jpg"/>
</div>

<div class="as-panel">
	<img class="as-background" src="path/to/blank.gif" data-src="path/to/image2.jpg" data-retina="path/to/image2@2x.jpg"/>
</div>

<div class="as-panel">
	<a href="https://bqworks.net">
		<img class="as-background" src="path/to/blank.gif" data-src="path/to/image3.jpg" data-retina="path/to/image3@2x.jpg"/>
	</a>
</div>
```

It's a naming convention to add the '@2x' suffix for the high resolution version of the image.

As you can see, it's possible to use lazy loading and high resolution images at the same time.

This module is showcased in example1.html, example2.html and example3.html.

---

### 5. Layers ###

Adds support for layers, which are blocks of text or HTML content that can easily be positioned, sized or animated.

Layers have several predefined styles and support various settings, all of which define the layers' look and behavior. The following example shows how to create two basic layers inside a panel. These layers will be static and we won't add any styling to them.

```html
<div class="as-panel">
	<img class="as-background" src="path/to/image1.jpg"/>
	<h3 class="as-layer">
		Lorem ipsum dolor sit amet
	</h3>
	<p class="as-layer">
		consectetur adipisicing elit
	</p>
</div>
```

As you can see above, the layers need to have the `as-layer` class, but they can be any HTML element: paragraphs, headings or just DIV elements.

Here is an example that adds some styling and animates the layers:

```html
<div class="as-panel">
	<img class="as-background" src="path/to/image1.jpg"/>
	<h3 class="as-layer as-closed as-black"
		data-position="bottomLeft" data-horizontal="10%"
		data-show-transition="left" data-show-delay="300" data-hide-transition="right">
		Lorem ipsum dolor sit amet
	</h3>
	<p class="as-layer as-opened as-white as-padding"
		data-width="200" data-horizontal="center" data-vertical="40%"
		data-show-transition="down" data-hide-transition="up">
		consectetur adipisicing elit
	</p>
</div>
```

There are several predefined classes that can be passed to layers in order to style them. The position, size and animations are set using data attributes. For a better organization of the HTML code, I added the classes, the attributes that set the position and size, and the attributes that set the animation on separate lines, but you can add them in a single line if you want to.

#### Predefined classes ####

`as-opened`

Sets the layer to be visible only when the panel is opened.

`as-closed`

Sets the layer to be visible only when the panel is closed.

`as-black`

Adds a black and transparent background and makes the font color white.

`as-white`

Adds a white and transparent background and makes the font color black.

`as-padding`

Adds a 10 pixel padding to the layer.

`as-rounded`

Makes the layer's corners rounded.

`as-vertical`

Changes the layer's orientation to vertical.

In the accordion's CSS file, accordion-slider.css, you can edit the properties specified for the above classes. For example, you can set the padding to 5 pixels instead of 10 pixels, or you can change the transparency of the black and white backgrounds. However, it's a best practice to add your custom styling in a separate CSS file instead of modifying the accordion's CSS.

#### Data attributes ####

`data-width`

Sets the width of the layer. Can be set to a fixed or percentage value. If it's not set, the layer's width will adapt to the width of the inner content.

`data-height`

Sets the height of the layer. Can be set to a fixed or percentage value. If it's not set, the layer's height will adapt to the height of the inner content.

`data-depth`

Sets the depth (z-index, in CSS terms) of the layer.

`data-position`

Sets the position of the layer. Can be set to 'topLeft' (which is the default value), 'topRight', 'bottomLeft' or 'bottomRight'.

`data-horizontal`

Sets the horizontal position of the layer, using the value specified for data-position as a reference point. Can be set to a fixed value, percentage value or to 'center'.

`data-vertical`

Sets the vertical position of the layer, using the value specified for data-position as a reference point. Can be set to a fixed value, percentage value or to 'center'.

`data-show-transition`

Sets the transition of the layer when it appears in the panel. Can be set to 'left', 'right', 'up' or 'down', these values describing the direction in which the layer will move when it appears.

`data-show-offset`

Sets an offset for the position of the layer from which the layer will be animated towards the final position when it appears in the panel. Needs to be set to a fixed value.

`data-show-duration`

Sets the duration of the show transition.

`data-show-delay`

Sets a delay for the show transition. This delay starts from the moment when the panel starts opening.

`data-hide-transition`

Sets the transition of the layer when it disappears from the panel. Can be set to 'left', 'right', 'up' or 'down', these values describing the direction in which the layer will move when it disappears.

`data-hide-offset`

Sets an offset for the position of the layer towards which the layer will be animated from the original position when it disappears from the panel. Needs to be set to a fixed value.

`data-hide-duration`

Sets the duration of the hide transition.

`data-hide-delay`

Sets a delay for the hide transition. This delay starts from the moment when the panel starts closing.

This module is showcased in example1.html, example3.html and example4.html.

---

### 6. Deep Linking ###

Provides the possibility to link to a specific panel in the accordion. You can use this to have the accordion opened at a specific panel when the page loads or to load a specific panel later at a later time.

The hash that needs to be appended to the URL consists of the 'id' attribute of the accordion and the index of the panel separated by a slash character (/). For example, `https://domain.com/page#my-accordion/0` will open the first panel (because panel indexes start with 0) in the accordion that has the 'id' set to 'my-accordion'.

It's also possible to specify the 'id' attribute of the panel instead of its index.

*Example:*

```html
<div id="my-accordion" class="accordion-slider">
	<div class="as-panels">
		<div class="as-panel">
			<img class="as-background" src="path/to/image1.jpg"/>
		</div>
		<div id="my-panel" class="as-panel">
			<img class="as-background" src="path/to/image2.jpg"/>
		</div>
		<div class="as-panel">
			<img class="as-background" src="path/to/image3.jpg"/>
		</div>
	</div>
</div>
```

In order to open the second panel, you can use either `https://domain.com/page#my-accordion/1` or `https://domain.com/page#my-accordion/my-panel`.

This module is showcased in example4.html.

---

### 7. Autoplay ###

Adds autoplay functionality.

__Customizable properties:__ [autoplay](#autoplay), [autoplayDelay](#autoplaydelay), [autoplayDirection](#autoplaydirection) and [autoplayOnHover](#autoplayonhover).

---

### 8. Touch Swipe ###

Although it's an optional module, you will most likely want to include it in all your projects, because it enables touch functionality for touch screen devices. The module also adds mouse drag functionality (on non-touch screen devices) when the accordion has more than one page.

__Customizable properties:__ [touchSwipe](#touchswipe) and [touchSwipeThreshold](#touchswipethreshold).

---

### 9. Buttons ###

Adds navigation buttons below the accordion.

__Customizable properties:__ [buttons](#buttons).

---

### 10. Keyboard ###

Adds keyboard navigation support. The next panel can be opened by pressing the right arrow key and the previous panel can be opened by pressing the left arrow key. Also, the Enter key will open the link attached to the background or opened background images.

By default, the accordion will respond to keyboard input all the time, not only when the accordion has focus. If you would like it to respond only when the accordion is in focus, you need to add the `tabindex=0` attribute to the main accordion `div` container:

```html
<div id="my-accordion" class="accordion-slider" tabindex="0">
	...
</div>
```

Also, you can add the `tabindex=-1` attribute to all anchor elements that are inside the accordion, in order to not allow these elements to get focus.

__Customizable properties:__ [keyboard](#keyboard) and [keyboardOnlyOnFocus](#keyboardonlyonfocus).

---

### 11. Mouse Wheel ###

Enables the accordion to respond to mouse wheel input.

__Customizable properties:__ [mouseWheel](#mouseWheel), [mouseWheelTarget](#mousewheeltarget) and [mouseWheelSensitivity](#mousewheelsensitivity).

---

### 12. Smart Video ###

Provides automatic control of the videos loaded inside the panels. For example, the video will pause automatically when the panel closes, or the autoplay, if enabled, will stop when a video starts playing. Inside the accordion, videos can be added in the main panel container or inside layers. 

The video types or providers supported by this module are: YouTube, Vimeo, HTML5, Video.js and SublimeVideo.

In order to have a video automatically controlled by the accordion, the video must have the `as-video` class. Also, there are some provider-specific requirements for the videos, as presented below.

__Customizable properties:__ [openPanelVideoAction](#openpanelvideoaction), [closePanelVideoAction](#closepanelvideoaction), [playVideoAction](#playvideoaction), [pauseVideoAction](#pausevideoaction) and [endVideoAction](#endvideoaction).

##### YouTube #####

The videos need to have the `enablejsapi=1` parameter appended to the URL of the video. It's also recommended to append the `wmode=opaque` parameter. The parameters need to be delimited by `&amp;`.

*Example:*

```html
<iframe class="as-video" src="https://www.youtube.com/embed/msIjWthwWwI?enablejsapi=1&amp;wmode=opaque" width="500" height="350" frameborder="0" allowfullscreen></iframe>
```

##### Vimeo #####

The videos need to have the `api=1` parameter appended to the URL of the video.

*Example:*

```html
<iframe class="as-video" src="https://player.vimeo.com/video/43401199?api=1" width="500" height="350" frameborder="0" allowfullscreen></iframe>
```

##### HTML5 #####

Simple HTML5 videos don't need any preparations other than having the `as-video` class.

*Example:*

```html
<video class="as-video" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

##### Video.js #####

Videos using Video.js also need the `as-video` class, in addition to the other video.js specific requirements, like adding the `video-js` class or the `data-setup={}` attribute.

*Example:*

```html
<video class="as-video video-js" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none" data-setup="{}">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

---

## Support ##

If you found a bug or have a feature suggestion, please submit it in the [Issues tracker](https://github.com/bqworks/accordion-slider-js/issues).

If you need extensive help with implementing the accordion slider in your project, you can contact me.

## License ##

The plugin is available under the <a href="https://opensource.org/licenses/MIT">MIT license</a>.