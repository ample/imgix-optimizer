import ImgixBgImage from './imgix_bg_image';
import ImgixImage from './imgix_image';
import Optimizer from './optimizer';

window['Imgix'] = window['Imgix'] || {};

Imgix.ImgixBgImage = ImgixBgImage;
Imgix.ImgixImage = ImgixImage;
Imgix.Optimizer = Optimizer;
