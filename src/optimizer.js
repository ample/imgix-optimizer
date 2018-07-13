import ImgixImage from './imgix_image';

export default class Optimizer {

  constructor(options = {}) {
    this.initOptions(options);
    this.optimizeImages();
  }

  initOptions(options = {}) {
    this.options = options;
    const defaultOptions = {
      parent: 'body',
      selector: 'img[data-optimize-img]'
    }
    for (const [key, value] of Object.entries(defaultOptions)) {
      if (!this.options[key]) { this.options[key] = value; }
    }
  }

  optimizeImages() {
    for (const img of $(`${this.options.parent} ${this.options.selector}`)) {
      const image = new ImgixImage(img);
    }
  }

}
