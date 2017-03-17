Example 1
=========

This example imagines multiple Brightspot plugins instantiated by a single <a href="https://www.webcomponents.org/">Web Component</a>.

This carousel is passing in structured data in a light DOM optimized for SEO and accessibility. Rendering could then be handled by the JS in a shadow DOM.

    <bsp-plugin block="Carousel" itemscope itemtype="http://schema.org/ImageGallery">
      <title itemprop="headline">Slideshow title</title>
      <description itemprop="about">Slideshow description</description>
      <slides>
        <slide itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
          <title itemprop="headline">Slide 1 title</title>
          <description itemprop="caption">Slide 1 description</description>
          <img src="image1.jpg" />
        </slide>
        <slide itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
          <title itemprop="headline">Slide 2 title</title>
          <description itemprop="caption">Slide 2 description</description>
          <img src="image2.jpg" />
        </slide>
        <slide itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
          <title itemprop="headline">Slide 3 title</title>
          <description itemprop="caption">Slide 3 description</description>
          <img src="image3.jpg" />
        </slide>
      </slides>
      <bsp-option name="infinite" boolean hidden public>true</bsp-option>
      <bsp-option name="slidesToShow" number required hidden>3</bsp-option>
    </bsp-plugin>

Passing options in XML reduces the complexity of encoding string values and allows us to expressively describe how options should work and have some baked-in error checking on the config before loading the plugin.

Both options have types associated (`boolean` and `number`, respectively).

The first option has a `public` attribute, which would expose this option as an attribute on the plugin element for CSS styling to key off of.

The second option has a `required` attribute. In addition to enforcing type, we could also enforce that an option must be passed for a plugin to load and throw a useful error when the option is not passed from the back end.

Somewhere in the web component JS there would need to be some logic to associate block names with Javascript classes/objects. So `All.js` might look kind of like:

    import Carousel from 'Carousel'

    // plugin registry
    let plugins = {}
    plugins.Carousel = Carousel

    class BspPluginElement extends HTMLElement {

      constructor () {
        let options =
        ... parse and do error checking of options ...

        let Plugin = plugins[this.attributes.block]
        if (Plugin) {
          this.instance = new Plugin(this, options)
        } else {
          throw new Error(`${this.attributes.block} not found in plugin registry`)
        }
      }

      connectedCallback () {
        if (this.instance.connectedCallback) {
          this.instance.connectedCallback.apply(null, arguments)
        }
      }

      disconnectedCallback () {
        if (this.instance.disconnectedCallback) {
          this.instance.disconnectedCallback.apply(null, arguments)
        }
      }

      attributeChangedCallback () {
        if (this.instance.attributeChangedCallback) {
          this.instance.attributeChangedCallback.apply(null, arguments)
        }
      }

      adoptedCallback () {
        if (this.instance.attributeChangedCallback) {
          this.instance.adoptedCallback.apply(null, arguments)
        }
      }

    }

    customElements.define('bsp-plugin', BspPluginElement)

Templates for shadow DOM could live in a variety of places. They could be written out in the Handlebars in a `<template>` tag, which is ignored by the DOM. Or they could be written in the Javascript as a template literal.

The plugin element could also be utilized in a more traditional way without using shadow DOM, which probably would be most of the time. This would facilitate backporting older modules to the new loader. It could look something like this...

Old code:

    <div class="{{blockName}}" data-my-plugin data-my-plugin-options='{
      "option1" : 3,
      "option2" : true,
      "option3" : "Some text",
      "option4" : {
        "suboption1" : 1,
        "suboption2" : 2
      }
    }'>
      ...some markup...
    </div>

New code:

    <bsp-plugin block="{{blockName}}">
      ...some markup...
      <bsp-option name="option1" type="number" required attribute>3</option>
      <bsp-option name="option2" type="bool">true</option>
      <bsp-option name="option3" type="string">Some text</option>
      <bsp-option name="option4" type="json">{
        "suboption1" : 1,
        "suboption2" : 2
      }</bsp-option>
    </bsp-plugin>

## Advantages specific to this approach

See README for general advantages/disadvantages of Web Components.

*   Would work in a familiar way while reducing boilerplate of parsing options
*   Wouldn't need to know much at all about Web Components to use this
*   Can share one component with multiple Javascripts easily when also using shadow DOM
*   By centralizing loading of plugins to one element, would make it easier to swap loading methods later if we needed to (ex: client must have IE8)

## Disadvantages specific to this approach

*   Can't take advantage of some features of custom elements (ex: make a custom element by extending a HTMLElementButton). Or at least not without a separate custom element that isn't a plugin.
