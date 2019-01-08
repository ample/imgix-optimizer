export default class Image {
  constructor(img) {
    // Length of crossfade transition.
    this.timeToFade = 500;
    // Data attribute applied before processing.
    this.processingAttr = 'data-imgix-img-processed';
    // The main image (pixelated placeholder).
    this.placeholderImg = $(img);
    // Configure the main placeholder image.
    this.initPlaceholder();
    // Kick off the optimization process.
    this.initOptimization();
  }

  /**
   * Load an image in memory (not within the DOM) with the same source as the
   * placeholder image. Once that has completed, we know we're safe to begin
   * listening for the image to intersect the viewport.
   */
  initOptimization() {
    $('<img>')
      .on('load', $.proxy(this.listenForIntersection, this))
      .attr('src', this.placeholderImg.attr('src'));
  }

  /**
   * When the placeholder image intersects the viewport, begin processing.
   * (IntersectionObserver and Object.assign() are not supported by IE, but the
   * polyfills are loaded by Imgix.Optimizer.)
   */
  listenForIntersection() {
    const observer = new IntersectionObserver($.proxy(this.onIntersection, this));
    observer.observe(this.placeholderImg[0]);
  }

  /**
   * When the placeholder image intersects the viewport, check if it is in the
   * viewport and has not yet been processed. If those conditions are true,
   * begin rendering the full size image and the transition process.
   */
  onIntersection(entries, observer) {
    let img = $(entries[0].target);
    if (!entries[0].isIntersecting || $(img).attr(this.processingAttr)) return;
    img.attr(this.processingAttr, true);
    this.renderFullSizeImg();
  }

  // ---------------------------------------- | Placeholder Image

  /**
   * Make necessary CSS adjustments to main placeholder image.
   */
  initPlaceholder() {
    this.setPlaceholderCss();
    this.setPlaceholderParentTmpCss();
  }

  /**
   * The main image must have a position set for it to remain in front of the
   * full-size image. We assume that if the element is not explicitly positioned
   * absolutely, then it can safely be positioned relatively.
   */
  setPlaceholderCss() {
    if (this.placeholderImg.css('position') != 'absolute') {
      this.placeholderImg.css('position', 'relative');
    }
  }

  /**
   * The parent of the image container should be relatively positioned
   * (temporarily) so temp image can be absolutely positioned.
   */
  setPlaceholderParentTmpCss() {
    this.parentStyles = {
      display: this.placeholderImg.parent().css('display'),
      position: this.placeholderImg.parent().css('position')
    };
    this.placeholderImg.parent().css({
      display: 'block',
      position: 'relative'
    });
  }

  // ---------------------------------------- | Full-Size Image

  /**
   * Render the full-size image behind the placeholder image.
   */
  renderFullSizeImg() {
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
  initFullSizeImg() {
    this.fullSizeImg = this.placeholderImg.clone();
  }

  /**
   * Give the full-size image a temporary set of CSS rules so that it can sit
   * directly behind the placeholder image while loading.
   */
  setFullSizeImgTempCss() {
    this.fullSizeImg.css({
      position: 'absolute',
      top: this.placeholderImg.position().top,
      left: this.placeholderImg.position().left,
      width: '100%',
      height: '100%'
    });
  }

  /**
   * Return the width and height of the placeholder image, including decimals.
   * Uses precise measurements like this helps ensure the element doesn't slide
   * when transitioning to the full size image.
   */
  getPlaceholderImgRect() {
    return {
      width: this.placeholderImg[0].getBoundingClientRect().width,
      height: this.placeholderImg[0].getBoundingClientRect().height
    };
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
  setFullSizeImgSrc() {
    let newSrc = this.placeholderImg
      .attr('src')
      .replace(/(\?|\&)(w=)(\d+)/i, '$1$2' + this.getPlaceholderImgRect().width)
      .replace(/(\?|\&)(h=)(\d+)/i, '$1$2' + this.getPlaceholderImgRect().height);
    // Add a height attribute if it is missing. This is the key to the image not
    // jumping around after transitioning to the full-size image.
    if (newSrc.search(/(\?|\&)(h=)(\d+)/i) < 0) {
      newSrc = `${newSrc}&h=${this.getPlaceholderImgRect().height}&fit=crop`;
    }
    this.fullSizeImg.attr('ix-src', newSrc);
    // TODO: Make this a configurable option or document it as a more semantic temporary class
    this.fullSizeImg.addClass('img-responsive imgix-optimizing');
    // TODO: This should respect the option from the Optimizer class for the select
    this.fullSizeImg.removeAttr('data-optimize-img');
  }

  /**
   * Render the full-size image in the DOM.
   */
  addFullSizeImgToDom() {
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
  initTransition() {
    this.fullSizeImg.on('load', () => this.transitionImg());
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
  transitionImg() {
    if (!this.placeholderImg) return true;
    this.fadeOutPlaceholder();
    setTimeout(() => {
      this.removeFullSizeImgProperties();
      this.replacePlaceholderParentTmpCss();
      this.removeImg();
    }, this.timeToFade);
  }

  /**
   * Fade out the placeholder image.
   */
  fadeOutPlaceholder() {
    this.placeholderImg.fadeTo(this.timeToFade, 0);
  }

  /**
   * Remove temporary styles and class from the full-size image, which
   * effectively means it has replaced the placeholder image.
   */
  removeFullSizeImgProperties() {
    this.fullSizeImg.removeAttr('style');
    // TODO: Update this with how the class is handled above.
    this.fullSizeImg.removeClass('imgix-optimizing');
  }

  /**
   * Reset the container's adjusted CSS properties.
   */
  replacePlaceholderParentTmpCss() {
    this.placeholderImg.parent().css({
      display: this.parentStyles.display,
      position: this.parentStyles.position
    });
  }

  /**
   * Remove the placeholder image from the DOM since we no longer need it.
   */
  removeImg() {
    if (!this.placeholderImg) {
      return;
    }
    this.placeholderImg.remove();
    this.placeholderImg = undefined;
  }
}
