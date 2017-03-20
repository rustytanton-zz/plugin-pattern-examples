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
*   It is not clear why it is necessary to always wait until `$(document).ready` to run module init code, as this is another drag on performance in most cases
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

2.    [Custom elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements). This is an emerging web standard that is designed to build self-contained modules like we build in Brightspot.

## Performance

Included in this repo are three HTML files used to measure performance with the [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API):

*    [BspPluginExample.html](BspPluginExample.html) - tests performance of existing pattern
*    [MutationObserverExample.html](BspPluginExample.html) - tests performance of a standalone mutation observer
*    [CustomElementExample.html](BspPluginExample.html) - tests performance of a custom element

Below is a table with results from when these tests were run in various browsers/platforms:

### Test: Render 10,000 elements

| Method            | BspPlugin | Mutation Observer | Custom Element |
| ----------------- | --------- | ----------------- | -------------- |
| Chrome 57/Mac     | 0.065 sec | 0.015 sec         | 0.017 sec      |
| Firefox 52/Mac    | 0.106 sec | 0.005 sec         | 0.025 sec      |
| Safari/Mac        | 0.060 sec | 0.003 sec         | 0.016 sec      |
