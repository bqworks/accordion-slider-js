export const basicAccordion = `
<div id="accordion-slider" class="accordion-slider as-no-js">
    <div class="as-panels">
        <div class="as-panel">1</div>
        <div class="as-panel">2</div>
        <div class="as-panel">3</div>
        <div class="as-panel">4</div>
        <div class="as-panel">5</div>
    </div>
</div>`;

export const swapBackgroundAccordion = `
<div id="accordion-slider" class="accordion-slider as-no-js">
    <div class="as-panels">
        <div class="as-panel">
            <img class="as-background" src="blank.gif" />
            <img class="as-background-opened" src="blank.gif" />
        </div>
        <div class="as-panel">
            <img class="as-background" src="blank.gif" />
            <img class="as-background-opened" src="blank.gif" />
        </div>
        <div class="as-panel">
            <img class="as-background" src="blank.gif" />
            <img class="as-background-opened" src="blank.gif" />
        </div>
        <div class="as-panel">
            <img class="as-background" src="blank.gif" />
            <img class="as-background-opened" src="blank.gif" />
        </div>
        <div class="as-panel">
            <img class="as-background" src="blank.gif" />
            <img class="as-background-opened" src="blank.gif" />
        </div>
    </div>
</div>`;

export const keyboardAccordion = `
<div class="accordion-slider as-no-js">
    <div class="as-panels">
        <div class="as-panel">
            <a href="#"><img class="as-background" src="blank.gif" /></a>
        </div>
        <div class="as-panel">
            <a href="#"><img class="as-background" src="blank.gif" /></a>
        </div>
        <div class="as-panel">
            <a href="#"><img class="as-background" src="blank.gif" /></a>
        </div>
        <div class="as-panel">
            <a href="#"><img class="as-background" src="blank.gif" /></a>
        </div>
        <div class="as-panel">
            <a href="#"><img class="as-background" src="blank.gif" /></a>
        </div>
    </div>
</div>`;

export const HTML5Video = `
<video id="my-video" class="video" poster="poster.jpg" width="500" height="350" controls="controls" preload="none">
    <source src="video.mp4" type="video/mp4"/>
</video>
`;

export const YouTubeVideo = `
<iframe class="video" src="//www.youtu.be/embed/12345abc?enablejsapi=1&amp;wmode=opaque&rel=0" width="500" height="350" frameborder="0" allowfullscreen></iframe>
`;

export const VimeoVideo = `
<iframe class="video" src="//player.vimeo.com/video/12345" width="500" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
`;

export const VideoJSVideo = `
<video id="my-video" class="video video-js vjs-default-skin" poster="poster.jpg" width="500" height="350" controls="controls" preload="none" data-setup="{}">
	<source src="video.mp4" type="video/mp4"/>
</video>
`;

export const videoAccordion = `
<script></script>
<div id="slider" class="accordion-slider as-no-js">
    <div class="as-panels">
        <div class="as-panel">
            <video id="video-1" class="as-video mock-video" poster="poster.jpg" width="500" height="350" controls="controls" preload="none">
                <source src="video.mp4" type="video/mp4"/>
            </video>
        </div>
        <div class="as-panel">
            <video id="video-2" class="as-video mock-video" poster="poster.jpg" width="500" height="350" controls="controls" preload="none">
                <source src="video.mp4" type="video/mp4"/>
            </video>
        </div>
        <div class="as-panel">
            <a id="video-3" class="as-video mock-video" href="//www.youtu.be/watch?v=12345abc">
                <img src="poster.jpg" width="500" height="300"/>
            </a>
        </div>
        <div class="as-panel">
            <a id="video-4" class="as-video mock-video" href="//vimeo.com/12345abc">
                <img src="poster.jpg" width="500" height="300"/>
            </a>
        </div>
    </div>
</div>`;