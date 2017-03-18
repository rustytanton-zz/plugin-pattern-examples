Options Examples
================

It should be possible to separate the question of how to pass options from the back end into the Javascript plugin from the question of how plugins should be instantiated. These are options I've come up with so far, would like to get feedback on them and other ideas.

## How we do it now

A JSON object passed to a single element attribute:

    <div data-my-plugin data-my-plugin-options='{
        "option1" : "some text",
        "option2" : 3,
        "option3" : true
    }'>
      ... some mark-up ...
    </div>

### Advantages
*   Concise
*   Obvious what is happening

### Disadvantages
*   Limiting in that there isn't a clean way to describe how options should work. This will make more sense after looking at other examples.
*   Must manually do error checking and manually expose options as attributes on the element

## New Method 1: POA (plain old attributes)

One requirement for how to deal with options/settings is to have the ability to expose individual settings as attributes on the DOM element. The most obvious and straightforward way to do this is to just set the attributes from the get-go.

    <div data-option-1='some text' data-option-2='3' data-option-3='true'>
      ... some mark-up ...
    </div>

### Advantages

*   Simple way to expose options as attributes (all options are attributes)
*   Good readability for simple plugins
*   WYSIWYG

### Disadvantages

*   Limiting in that there isn't a clean way to describe how options should work. This will make more sense after looking at other examples.
*   You may not want to have all your options set as individual attributes for something that takes a lot of configuration, as code readability will suffer the more complex something gets.

## New Method 2: XML

I can almost hear you saying "eww, gross" but hear me out for a second.

    <div>
      ... some mark-up ...
      <script type="text/bsp-option" name="option1" required public boolean>true</script>
      <script type="text/bsp-option" name="option2" public string>some text</script>
    </div>

### Advantages

*   Can do some baked-in error checking with `required` and by defining data types with `boolean`, `string`, etc to make sure the plugin is getting what it needs from the back end. This could reduce a lot of boilerplate code in the JS and catch errors sooner in the integration phase.
*   Can selectively expose options as attributes on the element instead of always exposing everything.
*   Semantically more sound than other options because the browser won't render script tags, as most app configuration is separated from presentation elements
*   Simplifies encoding of text values

### Disadvantages

*   Not as obvious what's happening to someone looking at it the first time
*   More verbose
*   Not aesthetically pleasing

## New Method 3: Single JSON object with some custom syntax

This is a hybrid of the old way of doing things and Method 2.

    <div data-my-plugin data-my-plugin-options='{
      "option1[public,required,boolean]": true,
      "option2[string]": "some text"
    }'>
      ... some mark-up ...
    </div>

### Advantages

*   Same advantages as Method 2, and...
*   More concise
*   Would provide the most straightforward path to updating existing plugins to the new loader

### Disadvantages

*   Still not aesthetically pleasing, though not as bad as Method 2

## Javascript options/settings

With method 1, the most straightforward way to access settings in Javascript would be to simply access `element.attributes` and don't bother with any validation/checks. Leave that to individual plugins. That wouldn't

It would also be possible with other options to move all validation/function description into a class with decorators, so if you passed options like this:

    <div data-option-1='some text' data-option-2='3' data-option-3='true'>
      ... some mark-up ...
    </div>

You could write a JS class like this to validate settings:

    // assuming BspModule has shared functionality for option
    // management in all plugins
    class MyModule extends BspModule {
      @string @required @attribute
      option1

      @number
      option2

      @boolean
      option3
    }

This is the most aesthetically pleasing (to me) and is more flexible than other options, but you have to do more work for smaller plugins.
