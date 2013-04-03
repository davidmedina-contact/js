#Bring Flickr

##This jQuery plugin brings up to 20 images from any Flickr RSS

You can choose the size of images to bring:

+ Square thumbnails
+ Thumbnails
+ Small
+ Medium
+ Large
+ Original

The size selected must be available from the Flickr feed; otherwise Flickr returns a blank image.

The plugin will fill how many empty &lt;img&gt; objects it finds in the HTML.

If there's only 1 &lt;img&gt; object in the HTML and you choose to bring more than 1 image, the plugin will choose an image randomly.

###JS plugin options:

+ **amount:** Determines amount of images to bring. Max: 20.
*Default: 5*
+ **onComplete:** Function fired once all the images are loaded.
*Default: null [other: function]*
+ **rss:** Flickr RSS feed url.
*Default: My flickr feed!*
+ **size:** Size of the images to bring.
*Default: 'medium' [other: 'square', 'thumbnail', 'small', 'large', 'original']*

####[Demo](http://jdmedina.com/javascript/bring-flickr/ "Online demo") at my online portfolio
