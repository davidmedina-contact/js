#Auto Slideshow

##This jQuery plugin creates a slideshow that cycles through image items found in the HTML

**It has the following variations:**

+ **Picker controls:** One picker per slide plus a play/pause button.
+ **Thumbnails:** In addition to the picker controls, thumbnail controls are generated. The thumbnail images are assigned with CSS and the background-image property.
+ **Lookbook:** Next/Previous controls that loop through slides, slide count and a play/pause button.

**Other configuration options:**

+ Delay between slide change.
+ Slide fading speed.
+ Pick starting slide.
+ Toggle auto-play.
+ Cross-fading.
+ Spinner loading image.
+ Lookbook controls button naming.

###JS plugin options:

+ **delay:** Delay between each slide. Expressed in seconds. *Default: 6*
+ **fadeSpeed:** Fade-out speed. Expressed in seconds. *Default: 2*
+ **counter:** Starting slide. *Default: 1*
+ **autoPlay:** Tell the slideshow to start automatically. *Default: true [other: false]*
+ **option:** Variations of the slideshow. *Default: 'pickers' [other: 'thumbnails', 'lookbook']*
+ **crossFade:** Cross-fade slides or fade-out then fade-in. *Default: true [other: false]*
+ **preLoadImg:** Use a spinner image in the container background while the slideshow images load. *Default: true [other: false]*
+ **lbNextTxt, lbPrevTxt, lbSlideTxt:** Define the button labels for the Next, Previous and Slideshow in the lookbook option. *Default: next, previous, slideshow*

####[Demo](http://jdmedina.com/javascript/slideshow/ "Online demo") at my online portfolio

###Credits:

This plugin uses the [Images Loaded jQuery Plugin](http://desandro.github.com/imagesloaded/ "Images Loaded jQuery Plugin Github") by David DeSandro.

This demo uses the [Bring Flickr Plugin](https://github.com/jdmedina/js/tree/master/bringFlickr "Bring Flickr Plugin") also developed by me.
