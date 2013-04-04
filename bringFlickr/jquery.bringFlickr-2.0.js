/**
 * @author JD Medina (www.jdmedina.com)
 * v2.0
 * @date 3/28/2013
 * Last update from: Cold, cold Minneapolis, MN 
 * jQuery Plug-in for bringing Flickr RSS pictures
 * @ jQuery Plug-in
 * @param {Array} options            Options that override the defaults
 * @param {Array} defaults           Default options. Please see below
 * @return {Object}                  jQuery object of the container
 * @example:
 * $('.js_bringFlickr').bringFlickr({
        amount : 11,
        rss : 'http://api.flickr.com/services/feeds/photoset.gne?set=72157622891753273&nsid=46213070@N00&lang=en-us',
        size : 'square'
    });
*/

(function ($) {

    $.fn.bringFlickr = function (options) {
        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () {
                $(this).bringFlickr(options);
            });
            return this;
        }

        // PRIVATE properties;
        var self = this, feed, li, img, thumb, title, imgURL, imgUrlStart, imgUrlEnd,

        // setup options by default
        defaults = {
            amount : 5, // How many images to bring. Min: 1 - Max: 20
            onComplete : null, // Callback function fired upon image load
            rss : 'http://api.flickr.com/services/feeds/photos_public.gne?tags=art&lang=en-us&format=rss_200', // RSS feed URL
            size : 'medium' // Sizes: 'square', 'thumbnail', 'small', 'medium', 'large', 'original'
        };

        //Extend options
        options = $.extend({}, defaults, options);

        // PUBLIC properties;
        this.jsonReady = false;

        // PRIVATE methods;
        function NextRandomNumber() {
            var hi   = this.seed / this.Q,
            lo   = this.seed % this.Q,
            test = this.A * lo - this.R * hi;

            if (test > 0) {
                this.seed = test;
            } else {
                this.seed = test + this.M;
            }
            return (this.seed * this.oneOverM);
        }

        function RandomNumberGenerator() {
            var d = new Date();
            this.seed = 2345678901 + (d.getSeconds() * 0xFFFFFF) + (d.getMinutes() * 0xFFFF);
            this.A = 48271;
            this.M = 2147483647;
            this.Q = this.M / this.A;
            this.R = this.M % this.A;
            this.oneOverM = 1.0 / this.M;
            this.next = NextRandomNumber;
            return this;
        }

        function CreateRandomNumber(Min, Max) {
            var rand = new RandomNumberGenerator();
            return Math.round((Max - Min) * rand.next() + Min);
        }

        // PUBLIC methods;
        this.changeOptions = function (newOpts) {
            var opts;
            for (opts in newOpts) {
                if (newOpts.hasOwnProperty(opts)) {
                    switch (opts) {

                    case 'size':
                        options.size = newOpts[opts];
                        break;

                    case 'amount':
                        options.amount = newOpts[opts];
                        break;

                    case 'rss':
                        options.rss = newOpts[opts];
                        break;
                    }
                }
            }
            self.initialize();
        };

        this.initialize = function () {

            var randImgArr = [], newImg;

            feed = 'http://pipes.yahoo.com/pipes/pipe.run?_id=9abb5269564e4b17fdb03660bfcf1371&_render=json&ammount=' + options.amount + '&feed=' + encodeURIComponent((options.rss).replace('&#64;', '%40')) + '&size=' + options.size + '&_callback=?';
            li = $(self).find('li');
            img = li.find('img');
            thumb = li.find('a.thumb');
            title = li.find('a.title');

            $(self).find('li:last').addClass('last-child');

            $.getJSON(feed, function (json) {
                $.each(json.value.items, function (i, item) {
                    imgUrlStart = (item.description).indexOf('src="');
                    imgUrlEnd = (item.description).indexOf('.jpg');
                    imgURL = (item.description).slice(imgUrlStart + 5, imgUrlEnd + 4);
                    randImgArr[i] = imgURL;

                    if (li.length !== 1) {
                        newImg = document.createElement('IMG');
                        newImg.src = imgURL;

                        $(newImg).attr('alt', 'Flickr Image').replaceAll(img.eq(i));
                        thumb.eq(i).attr('title', item.title);
                        if (item.content) {
                            imgUrlStart = (item.content.content).indexOf('src="');
                            imgUrlEnd = (item.content.content).indexOf('.jpg');
                            imgURL = (item.content.content).slice(imgUrlStart + 5, imgUrlEnd - 2) + '.jpg';
                            thumb.eq(i).attr('href', imgURL);
                        }
                        if (item.title.indexOf('|') !== -1) {
                            title.eq(i).text(item.title.split('|')[0]);
                        } else {
                            title.eq(i).text(item.title);
                        }
                        title.eq(i).attr('title', item.title);
                        title.eq(i).attr('href', item.link);
                    }
                });

                if (li.length === 1) {
                    imgURL = randImgArr[CreateRandomNumber(0, randImgArr.length - 1)];
                    newImg = document.createElement('IMG');
                    newImg.src = imgURL;
                    $(newImg).attr('alt', 'Flickr Image').replaceAll(img);
                }

                if (typeof options.onComplete === 'function') {
                    options.onComplete(self);
                }
            }); //json
        }; //init

        // Run INIT
        self.initialize();
        return this;
    };

})(jQuery);