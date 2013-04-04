/**
 * @author JD Medina (www.jdmedina.com)
 * v2.0
 * @date 3/27/2013
 * Last update from: Cold, cold Minneapolis, MN 
 * All Functionality related with the Auto Slideshow 
 * @ jQuery Plug-in
 * @param {Array} options - Options that override the defaults
 * @param {Array} defaults - Default options. Please see below
 * @return {Object} - jQuery object of the slideshow container
 * @example:
 * $('.js_autoSlideShow').autoSlideShow({
        delay : 5,
        fadeSpeed : 0.5,
        option : 'loookbook'
    });
});
 *
 * Release log:
 *
 * v2.0
 * Complete re-vamp! No more styling on the JS side. The styling will be managed by a CSS file (jquery.autoSlideShow-2.0.css). This means less lines of code, more flexibility and peace of mind. Most of the change slide functionality has been cleaned up. Also, the compact version is gone! You can do this with CSS, come on!
 * This plugin uses the Images Loaded jQuery Plugin by David DeSandro - http://desandro.github.com/imagesloaded/
 */

(function ($) {
    $.fn.autoSlideShow = function (options) {
        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () {
                $(this).autoSlideShow(options);
            });
            return this;
        }

        // PRIVATE Properties;
        var self = this,
        wrap = $(self).children('div.holder'),
        items = wrap.find('li'),
        timer = 0,

        pickers, thumbnails, contrAnchors, playPause, ppTxt, slideCount, prevNext, slide, fadeSec, delaySec,

        // setup options by default
        defaults = {
            delay : 6, // delay between each slide. expressed in seconds
            fadeSpeed : 2, // fade-oout speed. expressed in seconds
            counter : 1, // tell which slide to start on
            autoPlay : true, // Autoplay: true, false
            option : 'pickers', // options: 'pickers', 'thumbnails', 'lookbook'
            crossFade : true, // Crossfade option
            preLoadImg : true, // Use loading spinner image in the div holder (as background)
            lbNextTxt : 'next', // Define text for the Next button
            lbPrevTxt : 'previous', // Define text for the Previous button
            lbSlideTxt : 'slideshow', // Define text for the the slideshow name
            changeEvent : 'click' // Define the event for the Control pickers
        };

        options = $.extend({}, defaults, options);
        slide = options.counter - 1;
        fadeSec = options.fadeSpeed * 1000;
        delaySec = options.delay * 1000;

        // Change options (PUBLIC Method)
        this.changeOptions = function (newOpts, callback) {
            var opts;
            for (opts in newOpts) {
                if (newOpts.hasOwnProperty(opts)) {
                    switch (opts) {

                    case 'delay':
                        options.delay = newOpts[opts];
                        break;

                    case 'fadeSpeed':
                        options.fadeSpeed = newOpts[opts];
                        fadeSec = options.fadeSpeed * 1000;
                        break;

                    case 'option':
                        if (pickers !== undefined) {
                            pickers.remove();
                        }
                        if (thumbnails !== undefined) {
                            thumbnails.remove();
                        }
                        options.option = newOpts[opts];
                        pickers = thumbnails = contrAnchors = playPause = undefined;
                        options.autoPlay = false;
                        self.initialize();
                        break;
                    }

                    if (typeof callback === 'function') {
                        callback(self);
                    }
                }
            }
        };

        // PRIVATE Methods
        function lookBookAdj() {
            slideCount.text('slide ' + (slide + 1) + ' of ' + items.length);

            prevNext.find('a.previous').attr('href', '#slide' + slide);
            prevNext.find('a.next').attr('href', '#slide' + (slide + 2));

            if (slide === 0) {
                prevNext.find('a.previous').attr('href', '#slide' + items.length);
            } else if (slide + 1 === items.length) {
                prevNext.find('a.next').attr('href', '#slide' + 1);
            }
        }

        function changePickers(ul) {
            ul.find('li a').removeClass('active');
            ul.find('li a').eq(slide).addClass('active');
        }

        function pickSlide(picked, fast) {
            var fade = fadeSec;
            if (fast) {
                fade = fadeSec / 4;
            }

            function fadeIn() {
                items.eq(picked - 1).fadeIn(fade);
                slide = picked - 1;

                if (options.option === 'lookbook') {
                    lookBookAdj();
                }
                if (pickers !== undefined) {
                    changePickers(pickers);
                }
                if (thumbnails !== undefined) {
                    changePickers(thumbnails);
                }
            }

            items.eq(slide).fadeOut(fade, function () {
                if (!options.crossFade) {
                    fadeIn();
                }
            });
            if (options.crossFade) {
                fadeIn();
            }
        }

        function changeSlide() {
            // If this is the last slide
            if (slide === items.length - 1) {
                pickSlide(1);
            } else {
                // Jump to next slide
                pickSlide(slide + 2);
            }

            if (options.autoPlay) {
                timer = setTimeout(function () {
                    timer = changeSlide();
                }, delaySec);

                return timer;
            }
        }

        // INIT Methods
        this.initialize = function () {
            // support MetaData plugin
            if ($.meta) {
                options = $.extend({}, options, this.data());
            }

            if (options.preLoadImg) {
                $(self).addClass('preLoader');
            }

            // Pickers
            if (options.option === 'pickers' || options.option === 'thumbnails') {
                wrap.prepend('<ul class="pickers"></ul>');
                pickers = wrap.find('ul.pickers');

                items.each(function (i, e) {
                    pickers.append('<li><a href="#slide' + (i + 1) + '" title="Slide ' + (i + 1) + '">' + (i + 1) + '</a></li>');
                });
                changePickers(pickers);
            }

            // Thumbnails
            if (options.option === 'thumbnails') {
                wrap.prepend('<ul class="thumb"></ul>');
                thumbnails = wrap.find('ul.thumb');

                items.each(function (i, e) {
                    thumbnails.append('<li><a href="#slide' + (i + 1) + '" title="Slide ' + (i + 1) + '">' + (i + 1) + '</a></li>');
                });
                changePickers(thumbnails);
            }

            // Lookbook
            if (options.option === 'lookbook') {
                wrap.prepend('<ul class="lookbook"></ul>');
                pickers = wrap.find('ul.lookbook');

                pickers.append('<li class="slideCount">slide ' + (slide + 1) + ' of ' + items.length + '</li>');
                pickers.append('<li class="prevNext"><a href="#slide' + slide + '" class="previous" title="Previous">' + options.lbPrevTxt + '</a><a href="#slide' + (slide + 2) + '" class="next" title="Next">' + options.lbNextTxt + '</a></li>');

                slideCount = pickers.find('li.slideCount');
                prevNext = pickers.find('li.prevNext');

                lookBookAdj();
            }

            // Controls
            contrAnchors = wrap.find('ul.pickers li a, ul.thumb li a, ul.lookbook li.prevNext a');

            // Play/Pause
            pickers.append('<li class="playPause"><a href="#pause" title="pause" class="pause">pause</a></li>');
            playPause = pickers.find('li.playPause a');

            // Attach click event to pickers or thumbs
            contrAnchors.unbind(options.changeEvent).bind(options.changeEvent, function (e) {
                e.preventDefault();
                $(e).blur();

                options.autoPlay = true;
                self.playPauseClick();
                pickSlide(($(this).attr('href')).split('#slide')[1], true);
            });

            // Attach Play/Pause
            playPause.unbind(options.changeEvent).bind(options.changeEvent, function (e) {
                e.preventDefault();
                $(e).blur();

                self.playPauseClick();
            });

            // START the slideshow when the image gets loaded
            $(items).imagesLoaded(function ($images, $proper) {
                $(items).eq(slide).fadeIn(fadeSec);
                $(self).removeClass('preLoader');

                // Call playPauseClick() to determine if the slideshow must auto-start or not
                if (options.autoPlay) {
                    options.autoPlay = false;
                } else {
                    options.autoPlay = true;
                }
                self.playPauseClick();
            });

            return slide;
        };

        // Public methods
        this.playPauseClick = function () {
            if (options.autoPlay) {
                ppTxt = 'play';
                options.autoPlay = false;
                clearTimeout(timer);
                timer = 0;
            } else {
                ppTxt = 'pause';
                options.autoPlay = true;

                timer = setTimeout(function () {
                    timer = changeSlide();
                }, delaySec);
            }

            playPause.text(ppTxt + ' ' + options.lbSlideTxt).attr('title', ppTxt).removeClass('play pause').addClass(ppTxt);

            return options.autoPlay;
        };

        this.getOptions = function () {
            return options;
        };

        // Run INIT for more than 1 item
        if (items.length > 1) {
            self.initialize();
            return this;
        } else if (items.length === 1) {
            items.show();
        }
    };
})(jQuery);

// Images Loaded Plugin by David DeSandro - http://desandro.github.com/imagesloaded/
(function(c,q){var m="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";c.fn.imagesLoaded=function(f){function n(){var b=c(j),a=c(h);d&&(h.length?d.reject(e,b,a):d.resolve(e));c.isFunction(f)&&f.call(g,e,b,a)}function p(b){k(b.target,"error"===b.type)}function k(b,a){b.src===m||-1!==c.inArray(b,l)||(l.push(b),a?h.push(b):j.push(b),c.data(b,"imagesLoaded",{isBroken:a,src:b.src}),r&&d.notifyWith(c(b),[a,e,c(j),c(h)]),e.length===l.length&&(setTimeout(n),e.unbind(".imagesLoaded",
p)))}var g=this,d=c.isFunction(c.Deferred)?c.Deferred():0,r=c.isFunction(d.notify),e=g.find("img").add(g.filter("img")),l=[],j=[],h=[];c.isPlainObject(f)&&c.each(f,function(b,a){if("callback"===b)f=a;else if(d)d[b](a)});e.length?e.bind("load.imagesLoaded error.imagesLoaded",p).each(function(b,a){var d=a.src,e=c.data(a,"imagesLoaded");if(e&&e.src===d)k(a,e.isBroken);else if(a.complete&&a.naturalWidth!==q)k(a,0===a.naturalWidth||0===a.naturalHeight);else if(a.readyState||a.complete)a.src=m,a.src=d}):
n();return d?d.promise(g):g}})(jQuery);