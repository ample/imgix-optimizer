export default class ImgixImage {

  constructor(img) {
    // Length of crossfade transition.
    this.timeToFade = 250;
    // Main (pixellated placeholder) image.
    this.img = $(img);
    // Kick off the optimization process.
    this.initOptimization();
  }

  /**
   * Load an image in memory with the same source as the main image. Once that has
   * completed, we know we're safe to kick off the processing.
   */
  initOptimization() {
    $('<img>')
      .on('load', $.proxy(this.renderTmpImg, this))
      .attr('src', this.img.attr('src'));
  }

  // ---------------------------------------- | Temp Image

  /**
   * Render the temp image behind the main image.
   */
  renderTmpImg() {
    this.initTmpImg();
    this.setTmpImgCss();
    this.setTmpImgSrc();
    this.addTmpImgToDom();
    this.initTransition();
  }

  /**
   * Temp image is a duplicate of the main image used to achieve the fading
   * effect.
   */
  initTmpImg() {
    this.tmpImg = this.img.clone();
  }

  /**
   * Set the CSS of the temp element to sit directly behind the pixelated image.
   */
  setTmpImgCss() {
    this.tmpImg.css({
      position: 'absolute',
      top: this.img.position().top,
      left: this.img.position().left,
      width: this.img.width(),
      height: this.img.height(),
      // zIndex: this.getTmpImgZ()
    });
  }

  /**
   * Temp image sits directly behind the main image, so it should have a z of 1
   * less than the main image.
   */
  getTmpImgZ() {
    let z = parseInt(this.img.css('z-index'));
    if (isNaN(z)) { z = 0; }
    return z - 1;
  }

  /**
   * Prep temp image for imgix. We replace the placeholder URL with the proper
   * dimensions for the space for browsers that don't support srcset/sizes. We
   * are not currently listening for changes in this regard, so older browsers
   * will not see this image change size if the window is resized.
   */
  setTmpImgSrc() {
    var newSrc = this.img.attr('src')
      .replace(/(\?|\&)(w=)(\d+)/i, '$1$2' + this.img.width())
      .replace(/(\?|\&)(h=)(\d+)/i, '$1$2' + this.img.height());
    this.tmpImg.attr('ix-src', newSrc);
    this.tmpImg.addClass('img-responsive tmp-img-placeholder');
    this.tmpImg.removeAttr('data-optimize-img');
  }

  /**
   * Add temp image to the DOM.
   */
  addTmpImgToDom() {
    this.tmpImg.insertBefore(this.img);
  }

  // ---------------------------------------- | Image Transition

  /**
   * Once the image is loaded, start the transition. This is the critical piece.
   * imgix.js uses the ix-src attribute to build out the srcset attribute. Then,
   * based on the sizes attribute, the browser determines which source to
   * render. Therefore we can't preload in memory because we need imgix to do
   * its thing directly in the DOM.
   */
  initTransition() {
    // this.tmpImg.on('load', $.proxy(this.transitionImg, this));
    imgix.init();
  }

  /**
   * Remove the something ...
   */
  transitionImg() {
    this.fadeOutPlaceholder();
    setTimeout($.proxy(function() {
      this.removeTmpImgProperties();
      this.removeImg();
    }, this), this.timeToFade);
  }

  /**
   * Temporarily fade out placeholder image. We will fade it back in after
   * replacing its source with the appropriate value.
   */
  fadeOutPlaceholder() {
    this.img.fadeTo(this.timeToFade, 0);
  }

  /**
   * Remove temporary styles and class from the temp image, which effectively
   * replaces the main image.
   */
  removeTmpImgProperties() {
    this.tmpImg.removeAttr('style');
    this.tmpImg.removeClass('tmp-img-placeholder');
    // this.tmpImg.attr('data-img-processed', true);
  }

  /**
   * Remove main image from the DOM.
   */
  removeImg() {
    if(!this.img) { return }
    this.img.remove();
    this.img = undefined;
  }

}
