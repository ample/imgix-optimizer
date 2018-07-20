(function () {
  'use strict';

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var ImgixBgImage = function () {
    function ImgixBgImage(el) {
      _classCallCheck(this, ImgixBgImage);

      // Length of time to complete fade-in transition.
      this.timeToFade = 500;
      // The primary element (i.e. the one with the background image).
      this.el = $(el);
      // Background image CSS property must be present.
      if (this.el.css('background-image') == 'none') {
        return;
      }
      // Prepare the element and its container for optimization.
      this.initEl();
      // Kick off the optimization process.
      this.initOptimization();
      // Listen for window resize events.
      this.initEventListeners();
    }

    /**
     * Load an image in memory (not within the DOM) with the same source as the
     * placeholder image. Once that has completed, we know we're safe to begin
     * processing.
     */


    _createClass(ImgixBgImage, [{
      key: 'initOptimization',
      value: function initOptimization() {
        var _this = this;

        $('<img>').on('load', function () {
          return _this.renderTmpPlaceholderEl();
        }).attr('src', this.placeholderImgUrl);
      }

      // ---------------------------------------- | Main Element

      /**
       * Prepare the main element and its container for optimization.
       */

    }, {
      key: 'initEl',
      value: function initEl() {
        this.setPlaceholderImgUrl();
        this.setContainerTmpCss();
        this.setElTmpCss();
      }

      /**
       * Set reference to original image URL, which is expected to be a small
       * placeholder.
       */

    }, {
      key: 'setPlaceholderImgUrl',
      value: function setPlaceholderImgUrl() {
        this.placeholderImgUrl = this.el.css('background-image').replace('url(', '').replace(')', '').replace(/\"/gi, "").replace(/\'/gi, "").split(', ')[0];
      }

      /**
       * The parent of our jumbotron container should be relatively positioned
       * (temporarily) so that we can absolutely position the temp image in the
       * correct location.
       */

    }, {
      key: 'setContainerTmpCss',
      value: function setContainerTmpCss() {
        this.el.parent().css('position', 'relative');
      }

      /**
       * The main element must have a position set for it to be rendered on top of
       * the temporary full-size image. We assume that if the element is not
       * explicitly positioned absolutely, then it can safely be positioned
       * relatively.
       */

    }, {
      key: 'setElTmpCss',
      value: function setElTmpCss() {
        if (this.el.css('position') != 'absolute') {
          this.el.css('position', 'relative');
        }
      }

      // ---------------------------------------- | Placeholder Image (Temp)

      /**
       * Render a clone of the element with the background image directly behind
       * itself.
       */

    }, {
      key: 'renderTmpPlaceholderEl',
      value: function renderTmpPlaceholderEl() {
        this.initTmpPlaceholderEl();
        this.setTmpPlaceholderElCss();
        this.addTmpPlaceholderElToDom();
        this.renderFullSizeImg();
      }

      /**
       * Create a clone of the element with the background image. Remove content
       * from the clone -- often elements with a background image contain content.
       */

    }, {
      key: 'initTmpPlaceholderEl',
      value: function initTmpPlaceholderEl() {
        this.tmpPlaceholderEl = this.el.clone();
        this.tmpPlaceholderEl.html('');
      }

      /**
       * Position the clone directly behind the main element
       */

    }, {
      key: 'setTmpPlaceholderElCss',
      value: function setTmpPlaceholderElCss() {
        this.tmpPlaceholderEl.css({
          position: 'absolute',
          top: this.el.position().top,
          left: this.el.position().left,
          width: this.el.outerWidth(),
          height: this.el.outerHeight(),
          backgroundColor: 'transparent'
        });
      }

      /**
       * Add temporary element to the DOM, directly before the main element
       * containing the background image.
       */

    }, {
      key: 'addTmpPlaceholderElToDom',
      value: function addTmpPlaceholderElToDom() {
        this.tmpPlaceholderEl.insertBefore(this.el);
      }

      // ---------------------------------------- | Full-Size Image (Temp)

      /**
       * Create another clone, this time of the temporary placeholder image. This
       * new element sits behind the other two and is responsible for loading the
       * full-size image.
       */

    }, {
      key: 'renderFullSizeImg',
      value: function renderFullSizeImg() {
        this.removeElBgImg();
        this.initTmpFullSizeEl();
        this.setTmpFullSizeElImg();
        this.addTmpFullSizeElToDom();
        this.initTransition();
      }

      /**
       * Remove the background color and image from the main element. The user won't
       * notice this transition because the temp duplicate image is already set and
       * is sitting behind the primary element.
       *
       * This also stores a reference to the original background color so we can put
       * it back when the transition is complete.
       */

    }, {
      key: 'removeElBgImg',
      value: function removeElBgImg() {
        this.elBgColor = this.el.css('background-color');
        this.el.css('background-color', 'transparent');
        this.el.css('background-image', '');
      }

      /**
       * The temporary full-size element is a clone of the temporary placeholder
       * image element.
       */

    }, {
      key: 'initTmpFullSizeEl',
      value: function initTmpFullSizeEl() {
        this.tmpFullSizeEl = this.tmpPlaceholderEl.clone();
      }

      /**
       * Sets a reference to the full-size image URL based on the current dimensions
       * of the main element.
       */

    }, {
      key: 'setFullSizeImgUrl',
      value: function setFullSizeImgUrl() {
        // Work with the placeholdler image URL, which has been pulled from the
        // background-image css property of the main elements.
        var url = this.placeholderImgUrl.split('?');
        // q is an array of querystring parameters as ["k=v", "k=v", ...].
        var q = url[url.length - 1].split('&');
        // Mapping q converts the array to an object of querystring parameters as
        // { k: v, k: v, ... }.
        var args = {};
        q.map(function (x) {
          return args[x.split('=')[0]] = x.split('=')[1];
        });
        // If the image's container is wider than it is tall, we only set width and
        // unset height, and vice versa.
        if (this.el.width() >= this.el.height()) {
          args['w'] = this.el.width();
          delete args['h'];
        } else {
          args['h'] = this.el.height();
          delete args['w'];
        }
        // Redefine q and go the other direction -- take the args object and convert
        // it back to an array of querystring parameters, as ["k=v", "k=v", ...].
        q = [];
        for (var k in args) {
          q.push(k + '=' + args[k]);
        }
        // Store the result and return.
        return this.fullSizeImgUrl = url[0] + '?' + q.join('&');
      }

      /**
       * Change the URL of this temporary element's background image to be the
       * full-size image.
       */

    }, {
      key: 'setTmpFullSizeElImg',
      value: function setTmpFullSizeElImg() {
        this.setFullSizeImgUrl();
        this.tmpFullSizeEl.css('background-image', 'url("' + this.fullSizeImgUrl + '")');
      }

      /**
       * Add the temporary full-size element direct before the temporary placeholder
       * element.
       */

    }, {
      key: 'addTmpFullSizeElToDom',
      value: function addTmpFullSizeElToDom() {
        this.tmpFullSizeEl.insertBefore(this.tmpPlaceholderEl);
      }

      // ---------------------------------------- | Transition

      /**
       * Load full-size image in memory. When it has loaded we can confidentally
       * fade out the placeholder, knowing the full-size image will be in its place.
       */

    }, {
      key: 'initTransition',
      value: function initTransition() {
        $('<img>').on('load', $.proxy(this.transitionImg, this)).attr('src', this.fullSizeImgUrl);
      }

      /**
       * Fade out the temporary placeholder, set the background-image on the main
       * element to the full-size URL, then remove the temporary elements behind the
       * main element
       */

    }, {
      key: 'transitionImg',
      value: function transitionImg() {
        var _this2 = this;

        this.fadeOutTmpPlaceholderEl();
        setTimeout(function () {
          _this2.updateElImg();
          _this2.replaceElTmpCss();
          _this2.removeTmpEls();
        }, this.timeToFade);
      }

      /**
       * Fade out the placeholder element. This was the temporary clone of the main
       * element that has a placeholder background image.
       *
       * Rememeber the main element's background image was unset and its color set
       * to transparent. That is why fading out this temporary image will work
       * properly.
       */

    }, {
      key: 'fadeOutTmpPlaceholderEl',
      value: function fadeOutTmpPlaceholderEl() {
        this.tmpPlaceholderEl.fadeTo(this.timeToFade, 0);
      }

      /**
       * Reset the image URL (this helps if the size of the element has changed),
       * then set the background image to the new source.
       */

    }, {
      key: 'updateElImg',
      value: function updateElImg() {
        this.setFullSizeImgUrl();
        this.el.css('background-image', 'url(\'' + this.fullSizeImgUrl + '\')');
      }

      /**
       * Set the background color back to what it was before the transition.
       */

    }, {
      key: 'replaceElTmpCss',
      value: function replaceElTmpCss() {
        this.el.css('background-color', this.elBgColor);
      }

      /**
       * Remove both temporary elements from the DOM.
       */

    }, {
      key: 'removeTmpEls',
      value: function removeTmpEls() {
        this.tmpPlaceholderEl.remove();
        this.tmpFullSizeEl.remove();
        this.tmpPlaceholderEl = undefined;
        this.tmpFullSizeEl = undefined;
      }

      // ---------------------------------------- | Event Listeners

      /**
       * Listener for window resize events and update the image when the event ends.
       */

    }, {
      key: 'initEventListeners',
      value: function initEventListeners() {
        var _this3 = this;

        this.initResizeEnd();
        $(window).on('resizeEnd', function (event) {
          return _this3.updateElImg();
        });
      }

      /**
       * Trigger "resizeEnd" event on the window object after resizing has ceased
       * for at least 0.5 seconds.
       */

    }, {
      key: 'initResizeEnd',
      value: function initResizeEnd() {
        $(window).resize(function () {
          if (this.resizeTo) {
            clearTimeout(this.resizeTo);
          }
          this.resizeTo = setTimeout(function () {
            $(this).trigger('resizeEnd');
          }, 500);
        });
      }
    }]);

    return ImgixBgImage;
  }();

  var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var ImgixImage = function () {
    function ImgixImage(img) {
      _classCallCheck$1(this, ImgixImage);

      // Length of crossfade transition.
      this.timeToFade = 500;
      // Main (pixellated placeholder) image.
      this.placeholderImg = $(img);
      // Kick off the optimization process.
      this.initOptimization();
    }

    /**
     * Load an image in memory (not within the DOM) with the same source as the
     * placeholder image. Once that has completed, we know we're safe to begin
     * processing.
     */


    _createClass$1(ImgixImage, [{
      key: 'initOptimization',
      value: function initOptimization() {
        $('<img>').on('load', $.proxy(this.renderFullSizeImg, this)).attr('src', this.placeholderImg.attr('src'));
      }

      // ---------------------------------------- | Full-Size Image

      /**
       * Render the full-size image behind the placeholder image.
       */

    }, {
      key: 'renderFullSizeImg',
      value: function renderFullSizeImg() {
        this.initFullSizeImg();
        this.setFullSizeImgTempCss();
        this.setFullSizeImgSrc();
        this.addFullSizeImgToDom();
        this.initTransition();
      }

      /**
       * The full-size image is a clone of the placeholder image. This enables us to
       * easily replace it without losing any necessary styles or attributes.
       */

    }, {
      key: 'initFullSizeImg',
      value: function initFullSizeImg() {
        this.fullSizeImg = this.placeholderImg.clone();
      }

      /**
       * Give the full-size image a temporary set of CSS rules so that it can sit
       * directly behind the placeholder image while loading.
       */

    }, {
      key: 'setFullSizeImgTempCss',
      value: function setFullSizeImgTempCss() {
        this.fullSizeImg.css({
          position: 'absolute',
          top: this.placeholderImg.position().top,
          left: this.placeholderImg.position().left,
          width: this.placeholderImg.width(),
          height: this.placeholderImg.height()
        });
      }

      /**
       * Prep the full-size image with the attributes necessary to become its full
       * size. Right now it is still just a replica of the placeholder, sitting
       * right behind the placeholder.
       *
       * We set the src directly even though we're using imgix.js because older
       * browsers don't support the srcset attribute which is what imgix.js relies
       * upon.
       */

    }, {
      key: 'setFullSizeImgSrc',
      value: function setFullSizeImgSrc() {
        var newSrc = this.placeholderImg.attr('src').replace(/(\?|\&)(w=)(\d+)/i, '$1$2' + this.placeholderImg.width()).replace(/(\?|\&)(h=)(\d+)/i, '$1$2' + this.placeholderImg.height());
        this.fullSizeImg.attr('ix-src', newSrc);
        // TODO: Make this a configurable option or document it as a more semantic temporary class
        this.fullSizeImg.addClass('img-responsive tmp-img-placeholder');
        // TODO: This should respect the option from the Optimizer class for the select
        this.fullSizeImg.removeAttr('data-optimize-img');
      }

      /**
       * Render the full-size image in the DOM.
       */

    }, {
      key: 'addFullSizeImgToDom',
      value: function addFullSizeImgToDom() {
        this.fullSizeImg.insertBefore(this.placeholderImg);
      }

      // ---------------------------------------- | Image Transition

      /**
       * Once the full-size image is loaded, begin the transition. This is the
       * critical piece of this process. Imgix.js uses the ix-src attribute to build
       * out the srcset attribute. Then, based on the sizes attribute, the browser
       * determines which source to render. Therefore we can't preload in memory
       * because we need imgix to do its thing directly in the DOM.
       */

    }, {
      key: 'initTransition',
      value: function initTransition() {
        var _this = this;

        this.fullSizeImg.on('load', function () {
          return _this.transitionImg();
        });
        imgix.init();
      }

      /**
       * Fade out the placeholder image, effectively showing the image behind it.
       *
       * Once the fade out transition has completed, remove any temporary properties
       * from the full-size image (so it gets back to being a clone of the
       * placeholder, with the full-size src).
       *
       * Finally, remove the placeholder image from the DOM since we don't need it
       * any more.
       */

    }, {
      key: 'transitionImg',
      value: function transitionImg() {
        var _this2 = this;

        if (!this.placeholderImg) return true;
        this.fadeOutPlaceholder();
        setTimeout(function () {
          _this2.removeFullSizeImgProperties();
          _this2.removeImg();
        }, this.timeToFade);
      }

      /**
       * Fade out the placeholder image.
       */

    }, {
      key: 'fadeOutPlaceholder',
      value: function fadeOutPlaceholder() {
        this.placeholderImg.fadeTo(this.timeToFade, 0);
      }

      /**
       * Remove temporary styles and class from the full-size image, which
       * effectively means it has replaced the placeholder image.
       */

    }, {
      key: 'removeFullSizeImgProperties',
      value: function removeFullSizeImgProperties() {
        this.fullSizeImg.removeAttr('style');
        // TODO: Update this with how the class is handled above.
        this.fullSizeImg.removeClass('tmp-img-placeholder');
      }

      /**
       * Remove the placeholder image from the DOM since we no longer need it.
       */

    }, {
      key: 'removeImg',
      value: function removeImg() {
        if (!this.placeholderImg) {
          return;
        }
        this.placeholderImg.remove();
        this.placeholderImg = undefined;
      }
    }]);

    return ImgixImage;
  }();

  var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Optimizer = function () {
    function Optimizer() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck$2(this, Optimizer);

      this.initOptions(options);
      this.optimizeImages();
      this.optimizeBgImages();
    }

    // ---------------------------------------- | Options

    _createClass$2(Optimizer, [{
      key: 'initOptions',
      value: function initOptions() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.options = options;
        var defaultOptions = {
          parent: 'body'
        };
        for (var key in defaultOptions) {
          if (defaultOptions.hasOwnProperty(key) && !this.options[key]) {
            this.options[key] = defaultOptions[key];
          }
        }
      }

      // ---------------------------------------- | Inline Images

    }, {
      key: 'optimizeImages',
      value: function optimizeImages() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = $(this.options.parent + ' img[data-optimize-img]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var img = _step.value;

            new ImgixImage(img);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      // ---------------------------------------- | Background Images

    }, {
      key: 'optimizeBgImages',
      value: function optimizeBgImages() {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = $(this.options.parent + ' [data-optimize-bg-img]')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var img = _step2.value;

            new ImgixBgImage(img);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }]);

    return Optimizer;
  }();

  window['Imgix'] = window['Imgix'] || {};

  Imgix.ImgixBgImage = ImgixBgImage;
  Imgix.ImgixImage = ImgixImage;
  Imgix.Optimizer = Optimizer;

}());
