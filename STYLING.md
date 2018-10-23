# Global Theming Approach (CERD-212)

## Background

Assessment Web Components are built using Shadow DOM which guarantees CSS styles do not leak from on custom element to the other. Although this represents an advantage for composability, we still need the ability to style problems in a consistent way.

For example, we'd like to apply grade-specific fonts and colors to a set of problems.

## Definitions

### Theme

A theme is a set of styles that apply to all problems, or a whole lesson. A math lesson for grade K will most likely have a different **theme** than a math lesson for grade 9.

-   Different colors
-   Different set of fonts
-   Different font sizes
-   Different button styles
-   etc.

### Style

A **style** typically applies to a specific object, or a specific group of objects. For example, in a given problem with 2 multiple choice questions, the first one may be styled inline with options aligned horizontally, while the second element is styled as a block element, with options layed out in 2 columns.

## Requirements

**As an author** I want the ability to:

* Apply a set of common styles that apply across a lesson/test. We will call this a **theme**.
    * If problem 1 is used in test A, it must inherit test A styles.
    * If problem 1 is used in test B, it must inherit test B styles.
* Customize certain aspects of the theme according to given context parameters. A typical example is **grade-banding** where we have slight differences between school grades.
* Apply **problem styles**. These styles must not change whether a problem is used within test A or B. These styles are carried over with the problem. Examples are: 
    * whether MCQ options are layed-out horizontally or vertically
    * image or drag and drop zones position
    * responsiveness

These are different from *element styles* which are encapsulated in the shadow roots of each custom element. *Element styles* cannot be altered by authors.

**As a developer** I want to:

* Use a CSS processor **Sass** or **PostCSS** to better organize my styles across HMH products. Using *Sass* will also help ensuring consistency within a specific product. **Sass** is preferred here due to legacy and widespread knowledge across HMH, and because it is a mature toolchain and it is easy to set up.

### Notes on Problem Styles

*Feedback from Scott and Max*

It may not be desirable to keep a stylesheet along with each problem.
Styles enumerated above as examples for **problem styles**, could probably be exposed more safely using either CSS variables or custom element attributes.

* MCQ layout could be done by setting attributes on the `<multiple-choice>` element.
* Drop zone position can be achieved via either exposed CSS variables or element attributes.
* Not sure about responsiveness though.




## Proposed Approach

I propose that:

* theming stylesheets are sourced from a central location on the server `/css`. This ensure stylesheets are kept separate from the content, and can be modified without have to touch the content.
* CSS is built from Sass so we can share Sass partials.
* CSS files follow a strict naming convention:
    * `/css/custom-fonts.css` that loads custom fonts via `@font-face`. It's important to note that `@font-face` is not supported within a Shadow DOM, therefore, this file must be loaded at the HTML top level.
    * `/css/theme.css` delivers the overall **theme**. It won't apply to interactions due to shadow boundaries.
    * One separate css file for each interaction with the same name as the component HTML tag is used to **theme** interaction shadow DOMs: 
        * e.g. `<text-input>` => `/css/text-input.css`.
        * e.g. `<plot-graph>` => `/css/plot-graph.css`.
* ~~**Problem styles** are stored along with the Problem on the database, and are delivered by the server when the problem is loaded.~~
* **Problem styles** could be addressed using either exposed CSS variables or element attributes.
* Interaction specific **element styles** uses inline styles within the interaction template. When the web components are consumed via NPM, the server doesn't know how to properly resolve the external stylesheets (TODO: investigate further).

## Technical details

### CSS variables

CSS variables can pierce the shadow root to override custom styles. They are the recommended approach for custom elements styling.

However, it has some limitations:

-   Each custom element must expose a predefined set of CSS variables explicitly. Then only those exposed variables can be used to customize the elements style.
-   CSS variables can be applied to a single CSS attribute. Therefore, it's not well suited for theming, which usually involve more complex customization.

### Example

Expose CSS variables from within your custom element:

```css
positive {
    color: var(--positive-color, green);
}
negative {
    color: var(--negative-color, red);
}
neutral {
    color: var(--neutral-color, yellow);
}
```

Define the variables outside of the custom element:

```css
text-input {
    --positive-color: #46ab3b;
    --negative-color: #d90719;
    --neutral-color: #d4ab27;
}
```

CSS variables are pretty handy for **styling**, but not for **theming**.

### Stylesheet injection

The idea here is to inject a custom stylesheet in the Shadow Root of the element at runtime. 

We add a link tag to the element's template:

```html
<link rel="stylesheet" href="/css/text-input.css" />
```

And we have the server resolve the `/css` path to a central location where we make the stylesheet avaible.

Whenever the custom element renders its shadow DOM, it will load this CSS file in the shadow DOM.

### Shadow DOM limitations

> If you want to add custom fonts to your elements within the Shadow DOM, load the font-face into the Light DOM and then apply the font styles to the Shadow DOM (loading @font-face directly into Shadow DOM will NOT work!).
https://medium.com/rate-engineering/winning-the-war-of-css-conflicts-through-the-shadow-dom-de6c797b5cba