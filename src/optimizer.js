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
    for (let key in defaultOptions) {
      if (defaultOptions.hasOwnProperty(key) && !this.options[key]) {
        this.options[key] = defaultOptions[key];
      }
    }
  }

  // ---------------------------------------- | Inline Images

  optimizeImages() {
    $(`${this.options.parent} img[data-optimize-img]`).each((idx, img) => {
      new ImgixImage(img);
    });
  }

  // ---------------------------------------- | Background Images

  optimizeBgImages() {
    $(`${this.options.parent} [data-optimize-bg-img]`).each((idx, img) => {
      new ImgixBgImage(img);
    });
    return true;
  }

}
