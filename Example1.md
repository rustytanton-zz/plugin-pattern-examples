Example 1
=========

This example imagines multiple Brightspot plugins instantiated by a single <a href="https://www.webcomponents.org/">Web Component</a>.

The Handlebars code for a carousel component which utilizes shadow DOM might something look like this:

    {{#defineElement "title"}}
      <title itemprop="headline">{{this}}</title>
    {{/defineElement}}

    {{#defineElement "description"}}
      <description itemprop="about">{{this}}</description>
    {{/defineElement}}

    {{#defineElement "slides"}}
      <slides>
      {{#each this}}
        <slide itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
          <title itemprop="headline">{{title}}</title>
          <description itemprop="caption description">{{description}}</description>
          <image>{{image}}</image>
        </slide>
      {{/this}}
      </slides>
    {{/defineElement}}

    {{#defineElement "options"}}
      <bsp-options hidden>
      {{#each this}}
        <bsp-option name="{{name}}" type="{{type}}">{{value}}</bsp-option>
      {{/this}}
      </bsp-options>
    {{/defineElement}}

    {{#defineBlockContainer}}
    <bsp-plugin block="{{blockName}}" itemscope itemtype="http://schema.org/ImageGallery">
      {{#defineBlockBody}}
        {{element "title"}}
        {{element "description"}}
        {{element "slides"}}
        {{element "options"}}
      {{/defineBlockBody}}
    </bsp-plugin>
    {{/defineBlockContainer}}

It would output HTML that looks like:

    <bsp-plugin block="Carousel" itemscope itemtype="http://schema.org/ImageGallery">
      <title itemprop="headline">Slideshow title</title>
      <description itemprop="about">Slideshow description</description>
      <slides>
        <slide itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">

        </slide>
      </slides>
      <bsp-options hidden>
        <bsp-option name="infinite" type="bool">true</bsp-option>
        <bsp-option name="slidesToShow" type="number" required>3</bsp-option>
      </options>
    </bsp-plugin>

Note that the first option has a `required` attribute. In addition to enforcing type, we could also enforce that an option must be passed for a plugin to load and throw a useful error when the option is not passed.

Somewhere in the web component JS there would need to be some logic to associate block names with Javascript classes/objects. So our `All.js` might look kind of like:

    import Carousel from 'Carousel'

    // plugin registry
    let plugins = {}
    plugins.Carousel = Carousel

    class BspPlugin extends HTMLElement {

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
      <bsp-options hidden>
        <bsp-option name="option1" type="number">3</option>
        <bsp-option name="option2" type="bool">true</option>
        <bsp-option name="option3" type="string">Some text</option>
        <bsp-option name="option4" type="json">{
          "suboption1" : 1,
          "suboption2" : 2
        }</bsp-option>
      </bsp-options>
    </bsp-plugin>

## Advantages specific to this approach

See README for general advantages/disadvantages of Web Components.

*   Would work in a familiar way while reducing boilerplate of parsing options
*   Wouldn't need to know much at all about Web Components to use this
*   Can share one component with multiple Javascripts easily
*   By centralizing loading of plugins to one element, would make it easier to swap loading methods later if we needed to (ex: client must have IE8)

## Disadvantages specific to this approach

*   Can't take advantage of some features of custom elements (ex: make a custom element by extending a HTMLElementButton)
