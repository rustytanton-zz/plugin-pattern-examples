Plugin Pattern Examples
=======================

[Brightspot JS Utils](https://github.com/perfectsense/brightspot-js-utils) is ~4 years old, and as work on [Brightspot Express](https://github.com/perfectsense/brightspot-express) has progressed the FE team has determined it wants to revisit how Javascript plugins are loaded on a page. This repo has some examples and performance tests and is intended to facilitate that conversation.

## Terminology

A **module** is a library that something else (either a plugin or another module) loads.

A **plugin** is a module loader bound to the DOM.

## How Brightspot JS Utils plugins work now

A plugin is defined in the site's Javascript with some boilerplate code that looks like this:

    import bspUtils from 'bsp-utils'

    class MyModule {
      constructor ($el, options) {
        ... do some stuff ...
      }
    }

    bspUtils.plugin(false, 'bsp', 'my-plugin', {
      '_each': function (item) {
        $(item).data('bsp-my-plugin', new MyModule($(item), this.option(item)))
      }
    })

Then some HTML is dropped in the DOM that looks like this:

    <div data-my-module data-my-module-options='{
      "option1" : true,
      "option2" : 3
    }'>
      ... some HTML ...
    </div>

The JS will then instantiate the module on `$(document).ready` or when nodes are inserted in the DOM dynamically after `$(document).ready`

## Issues with current method

*   As browsers have adopted industry standards more consistently (ex: `document.querySelector`), it has become less desirable to assume that all projects will need [jQuery](https://jquery.com/) loaded by default since native methods are demonstrably more performant and not much more verbose/difficult to write than jQuery methods
*   Plugin loading boilerplate is unnecessarily verbose
*   It is not clear why it is necessary to always wait until `$(document).ready` to run module init code, as this is a drag on performance when it isn't necessary
*   Passing options as one large JSON blob does not save any work on the back end and creates more work on the front end when attributes need to be exposed individually on the DOM element for styling purposes

## Assumptions/requirements for a new pattern

In previous discussions with the FE team, any new plugin pattern would need to maintain (at minimum) these features:

*   Auto-instantiation configured on a DOM element
*   Ability to pass options from the back end to the front end plugin
*   Written to be more performant with vanilla Javascript so including jQuery or another library will not be necessary to use the plugin loader
*   Should not be opinionated about the modules it's loading. It should be able to accommodate lean modules without much overhead (i.e. shouldn't have to write two classes just to load a plugin that toggles a single element attribute true/false)

## A couple of options

These are not the only ways to load plugins, but these are a couple included in the repo to begin conversation about how to proceed.

1.    Standalone mutation observers that look for data attributes on DOM elements. bspUtils uses mutation observers now, but routes them through a jQuery `document.ready` call which degrades performance.

2.    [Custom elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements). This is an emerging web standard that is designed to build self-contained modules like we build in Brightspot. (see example in next section)

## Custom elements example

You can define a custom element in Javascript like this:

    class MyElement extends HTMLElement {
      constructor () {
        // called when the element is created
      }
      connectedCallback () {
        // do stuff when inserted in DOM
      }
      disconnectedCallback () {
        // do stuff when element is removed from the DOM
      }
      attributeChangedCallback () {
        // do stuff when an attribute on the element changes
      }
      adoptedCallback () {
        // do stuff when the element is adopted into a new document
      }
    }
    customElements.define('my-element', MyElement)

Then you can insert into the DOM like this:

    <my-element></my-element>

### Templates + Light DOM / Shadow DOM

Another potentially useful feature of custom elements is to provide an extra layer of separation between data structure and presentation.

Github uses [custom elements](https://github.com/github/time-elements) to extend the `<time>` element, which are good real-world examples of using Shadow DOM.

    <relative-time datetime="2017-04-01T16:30:00-08:00">
      April 1, 2017
    </relative-time>

If it were April 2, the Shadow DOM would render as "1 day ago" while search engines always see April 1, 2014.

In more complex applications, a single data structure could be rendered with multiple templates. Optionally, Javascript and CSS can be isolated to the Shadow DOM to make components even more self-contained.

## Performance

Included in this repo are three HTML files used to measure performance with the [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API):

*    [BspPluginExample.html](BspPluginExample.html) - tests performance of existing pattern
*    [MutationObserverExample.html](MutationObserverExample.html) - tests performance of a standalone mutation observer
*    [CustomElementExample.html](CustomElementExample.html) - tests performance of a custom element

Below is a table with results from when these tests were run in various browsers/platforms:

### Test: Render 10,000 elements

| Method                 | BspPlugin | Mutation Observer | vs. BspPlugin | Custom Element | vs. BspPlugin |
| ---------------------- | --------- | ----------------- | ------------- | -------------- | ------------- |
| Chrome 57/Mac          | 0.065 sec | 0.005 sec         | 13x faster    | 0.017 sec      | 4x faster     |
| Firefox 52/Mac         | 0.106 sec | 0.005 sec         | 21x faster    | 0.025 sec      | 4x faster     |
| Safari 10/Mac          | 0.060 sec | 0.002 sec         | 30x faster    | 0.016 sec      | 4x faster     |
| Safari 10/iOS          | 0.079 sec | 0.004 sec         | 20x faster    | 0.02 sec       | 4x faster     |
| IE11 (Win7/VirtualBox) | 1.123 sec | 0.012 sec         | 94x faster    | 0.135 sec      | 8x faster     |

The custom elements test is not working in IE9/IE10 at the moment, though it should be possible to get it working.

## Decision Points

*   Are benefits of Custom Elements (Light DOM/Shadow DOM, isolated JS/CSS, portability, etc) worth the performance penalty vs. a Mutation Observer and incompatibility with IE8?
*   If we are assuming we no longer expect plugin options to be passed as a single JSON blob, should any option management happen at all at the plugin level? Or should that be left to the modules?
*   If not using custom elements, should we refactor the existing BSP Plugin to use a standalone Mutation Observer without jQuery or create something new inside Brightspot Express?
*   If not using custom elements, is there any value to making all plugins wait until `document.ready` to load instead of handling that inside individual modules when explicitly necessary?
*   Are there any better options not listed here?
