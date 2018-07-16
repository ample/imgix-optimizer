export default class ImgixImage {

  constructor(img) {
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
  initOptimization() {
    $('<img>')
      .on('load', $.proxy(this.renderFullSizeImg, this))
      .attr('src', this.placeholderImg.attr('src'));
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
  setFullSizeImgSrc() {
    var newSrc = this.placeholderImg.attr('src')
      .replace(/(\?|\&)(w=)(\d+)/i, '$1$2' + this.placeholderImg.width())
      .replace(/(\?|\&)(h=)(\d+)/i, '$1$2' + this.placeholderImg.height());
    this.fullSizeImg.attr('ix-src', newSrc);
    // TODO: Make this a configurable option or document it as a more semantic temporary class
    this.fullSizeImg.addClass('img-responsive tmp-img-placeholder');
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
    this.fullSizeImg.removeClass('tmp-img-placeholder');
  }

  /**
   * Remove the placeholder image from the DOM since we no longer need it.
   */
  removeImg() {
    if(!this.placeholderImg) { return }
    this.placeholderImg.remove();
    this.placeholderImg = undefined;
  }
}
