/**
 * @author JD Medina (www.jdmedina.com)
 * v3.0
 * @date 3/28/2013
 * Last update from: San Francisco, CA
 * jQuery Plug-in for bringing public recent pictures from the Flickr flickr.people.getPhotos API based on your public API key in an HTML un-ordered list
 * @ jQuery Plug-in
 * @param {Array} options            Options that override the defaults
 * @param {Array} defaults           Default options. Please see below
 * @return {Object}                  jQuery object of the container
 * @example:
 * $('.js_bringFlickr').bringFlickr({
        amount : 11,
        apiUrl : 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&format=json&nojsoncallback=1',
        apiKey: '161db40db683c9acd864c22d26a3454f',
        user_id: '46213070@N00',
        size : 'z'
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
        var self = this, 
            url, 
            li, 
            img, 
            thumb, 
            title, 
            imgUrlStart, 
            imgUrlEnd,
            per_page,
            page = 1,
            imgURL,
            randImgArr = [],

        // setup options by default
        defaults = {
            amount : 5, // How many images to bring. Min: 1 - Max: 500
            onComplete : null, // Callback function fired upon image load
            apiUrl : 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&format=json&nojsoncallback=1', // API URL for recent pictures sans API key
            apiKey: '161db40db683c9acd864c22d26a3454f',
            user_id: '46213070@N00',
            size : 'z'
            // The letter suffixes are as follows:

            // s   small square 75x75
            // t   thumbnail, 100 on longest side
            // m   small, 240 on longest side
            // z   medium 640, 640 on longest side
            // b   large, 1024 on longest side*
        };

        //Extend options
        options = $.extend({}, defaults, options);

        // PUBLIC properties;
        this.jsonReady = false;

        // PRIVATE methods;
        function computeAmount () {
            // TODO: consider page start or offset
            per_page = options.amount;
        }

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

                    case 'apiUrl':
                        options.apiUrl = newOpts[opts];
                        break;

                    case 'apiKey':
                        options.apiKey = newOpts[opts];
                        break;
                    }
                }
            }
            self.initialize();
        };

        this.initialize = function () {

            var newImg,
                originalImg;

            url = options.apiUrl + '&api_key=' + options.apiKey + '&user_id=' + options.user_id + '&per_page=' + options.amount + '&page=' + page;
            li = $(self).find('li');
            img = li.find('img');
            thumb = li.find('a.thumb');
            title = li.find('a.title');

            $(self).find('li:last').addClass('last-child');

            $.getJSON(url, function (json) {
                if (json.stat === 'ok') {
                    $.each(json.photos.photo, function (i, item) {
                        // Flickr template URL with size
                        imgURL = 'https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg';

                        imgURL = imgURL.replace('{farm-id}', item.farm);
                        imgURL = imgURL.replace('{server-id}', item.server);
                        imgURL = imgURL.replace('{id}', item.id);
                        imgURL = imgURL.replace('{secret}', item.secret);
                        originalImg = imgURL.replace('[mstzb]', 'b');
                        imgURL = imgURL.replace('[mstzb]', options.size);

                        randImgArr[i] = imgURL;

                        // If you have more than one template <li> image
                        if (li.length !== 1) {
                            newImg = document.createElement('IMG');
                            newImg.src = imgURL;

                            //replace the template image with the one from Flickr
                            $(newImg).attr('alt', 'Flickr Image').replaceAll(img.eq(i));

                            // Add title attr on the thumbnail for supporting the lightbox plugin
                            thumb.eq(i).attr('title', item.title);

                            // assign the link href with the largest image URL from Flickr
                            thumb.eq(i).attr('href', originalImg);
                            
                            title.eq(i).text(item.title);
                            title.eq(i).attr('title', item.title);
                            title.eq(i).attr('href', item.link);
                        }
                    });//each

                    // Grab a random image from the randImgArr array when you have just one <li>
                    if (li.length === 1) {
                        imgURL = randImgArr[CreateRandomNumber(0, randImgArr.length - 1)];
                        newImg = document.createElement('IMG');
                        newImg.src = imgURL;

                        //replace the template image with the one from Flickr
                        $(newImg).attr('alt', 'Flickr Image').replaceAll(img);
                    }
                }//if ok

                // fire callback
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