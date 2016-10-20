#Bring Flickr

##This jQuery plugin brings up to 500 images from any Flickr RSS

You can choose the size of images to bring:

+ s   small square 75x75
+ t   thumbnail, 100 on longest side
+ m   small, 240 on longest side
+ z   medium 640, 640 on longest side
+ b   large, 1024 on longest side*

The size selected must be available from the Flickr feed; otherwise Flickr returns a blank image.

The plugin will fill how many empty &lt;img&gt; objects it finds in the HTML.

If there's only 1 &lt;img&gt; object in the HTML and you choose to bring more than 1 image in the amount, the plugin will choose an image randomly.

###JS plugin options:

+ **amount:** Determines amount of images to bring. Max: 20.
*Default: 5*
+ **onComplete:** Function fired once all the images are loaded.
*Default: null [other: function]*
+ **apiUrl:** Flickr API URL for recent pictures sans API key.
*Default: 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&format=json&nojsoncallback=1'*
+ **size:** Size of the images to bring.
*Default: 'z' [other: 's', 't', 'm', 'z', 'b']*

####[Demo](http://jdmedina.com/javascript/bring-flickr/ "Online demo") at my online portfolio
