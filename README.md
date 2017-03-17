Plugin Pattern Examples
=======================

Examples in this repo reimagine ways to instantiate Brightspot plugins and are intended to facilitate conversation, critiques, etc.

## Examples Scope
The PSD FE team agreed on some universal needs for a future Brightspot plugin pattern:

* Auto-instantiation via native or vanilla JS method, i.e. do not require a library such as jQuery  to instantiate a plugin
* Ability to pass options from Brightspot back end into the front end module
* Reduced boilerplate code vs. what is written now
* Many wishlist items named (event handling, element caching, etc.) are not in scope here. This exercise stops when the element has auto-instantiated a plugin through a DOM element and passed the element and options to the Javascript side of the plugin.

## About Web Components

Some of these examples imagine plugins instantiated by [Web Components](https://www.webcomponents.org/introduction). Advantages/disadvantages that are specific to an individual approach are documented within the individual examples. Some general advantages/disadvantages to Web Components are as follows:

### Advantages

* Eventually will provide a native, web standard browser method to auto instantiate plugins on DOM elements, which will work in practice much as Brightspot JS plugins are instantiated on DOM elements with data attributes now
* Should be much more performant when native support materializes
* Can optionally use Shadow DOM to allow a presentation to be further separated from content, i.e. the "light DOM" written to the page can be heavily-optimized for SEO, [schema.org](http://schema.org/), screen readers, etc. and the display HTML can do whatever ugly things it needs to do to make a UI work
* Can optionally isolate scope of CSS and Javascript to the component
* Would make components much more portable and self-contained than they are now

### Disadvantages

* Still only supported with a polyfill in most browsers
* Support for HTML imports (which makes using web components much nicer) is on hold indefinitely in Firefox, as the Firefox team wants to see how HTML imports vs. ES6+ module loader standards will evolve before committing to native support for either. We would want to avoid using this feature initially.
* Doesn't work at all in IE8, even with a polyfill, if that's something we care about
