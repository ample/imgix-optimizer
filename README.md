imgix Optimizer
==========

imgix Optimizer helps you optimize your application's performance by intelligently loading your image assets through [imgix](https://www.imgix.com/).

The optimizer's primary responsibility is to take small "placeholder" images you have loaded onto the page and load the appropriately-sized version after the page has been first painted.

Requirements
----------

This JavaScript libary relies on two other libraries:

- [jQuery](https://jquery.com/)
- [imgix.js](https://www.imgix.com/imgix-js)

This also assumes your project is already configured to [work with imgix](https://docs.imgix.com/setup).

Installation
----------

Once your requirements are in place, you can install the script as an NPM package or a ruby gem.

### NPM Package

Use the `npm` command-line utility to install this package and its dependencies:

    $ npm i imgix-optimizer --save

### Ruby Gem

If working with a Ruby project, add the gem to your Gemfile:

```rb
gem 'imgix-optimizer'
```

And then install with Bundler:

    $ bundle install

Usage
----------

Once your requirements are in place and the package is installed you can load the script on your page. The optimizer script should be loaded _after_ its dependencies.

```html
<body>
  <!-- ... -->

  <!-- Dependencies -->
  <script src="jquery.js"></script>
  <script src="imgix.js"></script>

  <!-- imgix Optimizer -->
  <script src="imgix-optimizer.js"></script>
</body>
```

_Note: `src` attribute in the example is just an example -- your source paths and filenames are likely different._

Once the scripts are loaded you can initialize the optimizer. This will loop through all images you have designated to be optimized and perform its magic. (See below for designating images.)

```js
new Imgix.Optimizer();
```

### Optimizing Images

There are two steps in setting up an image to be optimized:

1. Set the placeholder.
2. Add data attribute.

These two steps differ depending on whether the image is presented as a background image or inline.

#### Placeholder Image

One major benefit of imgix is that images can be resized on the fly simply by adding a few parameters. For example, I can take an image with a source of `https://images.unsplash.com/photo-1487222444179-52db5bc15efe` and present a `100px x 100px` cropped version of itself with the `w`, `h`, and `fit` parameters, such that a new source of `https://images.unsplash.com/photo-1487222444179-52db5bc15efe?w=100&h=100&fit=crop` yields this:

![](https://images.unsplash.com/photo-1487222444179-52db5bc15efe?w=100&h=100&fit=crop)

Given this flexibility, we can add pixelated placeholder images by loading really small images and stretching them to fill their space. And when we say small, we mean _small_. Your placeholder image does not need to be larger than `20px` unless you have a specific need in which you are looking for more definition in the initial load (although that will slow your page load time down).

So, for example, if you'd like to load a square placeholder image using the above source, you might make it `10px x 10px`, like so:

```html
<img src="https://images.unsplash.com/photo-1487222444179-52db5bc15efe?w=100&h=100&fit=crop" class="my-placeholder">
```

```css
.my-placeholder {
  width: 250px;
}
```

**The trick is that your placeholder image should be stretched to the size at which you ultimately want it displayed using CSS.**

Here's an example of what that might look like:

<img src="https://images.unsplash.com/photo-1487222444179-52db5bc15efe?w=10&h=10&fit=crop" style="width: 250px;">

#### Inline Images

For inline images, set the source directly as the placeholder image and add the `data-optimize-img` attribute.

```html
<img src="//images.unsplash.com/photo-1487222444179-52db5bc15efe?w=10&h=10&fit=crop" data-optimize-img>
```

_Hint: As mentioned, make sure you're setting the width of this image to match that of what the full-size image would be such that it stretches this placeholder and enables a smooth transition._

#### Background Images

For background images, the placeholder image should be the `background-image` CSS property and the data attribute is `data-optimize-bg-img`.

```html
<div style="background-image: url('//images.unsplash.com/photo-1487222444179-52db5bc15efe?w=10&h=10&fit=crop')" data-optimize-bg-img></div>
```

License
----------

This project is distributed under the [MIT license](LICENSE).
