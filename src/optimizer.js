import ImgixImage from './imgix_image';
import ImgixBgImage from './imgix_bg_image';

export default class Optimizer {

  constructor(options = {}) {
    this.initOptions(options);
    this.optimizeImages();
    this.optimizeBgImages();
  }

  // ---------------------------------------- | Options

  initOptions(options = {}) {
    this.options = options;
    const defaultOptions = {
      parent: 'body'
    }
    for (const [key, value] of Object.entries(defaultOptions)) {
      if (!this.options[key]) { this.options[key] = value; }
    }
  }

  // ---------------------------------------- | Inline Images

  optimizeImages() {
    for (const img of $(`${this.options.parent} img[data-optimize-img]`)) {
      new ImgixImage(img);
    }
  }

  // ---------------------------------------- | Background Images

  optimizeBgImages() {
    for (const img of $(`${this.options.parent} [data-optimize-bg-img]`)) {
      new ImgixBgImage(img);
    }
  }

}
