# Global Theming Approach (CERD-212)

## Background

Assessment Web Components are built using Shadow DOM which guarantees CSS styles do not leak from on custom element to the other. Although this represents an advantage for composability, we still need the ability to style problems in a consistent way.

For example, we'd like to apply grade-specific fonts and colors to a set of problems.

## Definitions

### Theme

A theme is a set of styles that apply to all problems, or a whole lesson. A math lesson for grade K will most likely have a different **theme** than a math lesson for grade 9.

* Different colors
* Different set of fonts
* Different font sizes
* Different button styles
* etc.

### Style

A *style* typically applies to a specific element, or a specific group of elements. For example, in a given problem with 2 multiple choice elements, the first one may be styles inline with options aligned horizontally, while the second element is styles as a block element, with options layed out in 2 columns.

## Solution 1: CSS variables

CSS variables can pierce the shadow root to override custom styles. They are the recommended approach for custom elements styling.

However, it has some limitations:

* Each custom element must expose a predefined set of CSS variables explicitly. Then only those exposed variables can be used to customize the elements style.
* CSS variables can be applied to a single CSS attribute. Therefore, it's not well suited for theming, which usually involve more complex customization.


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
    --positive-color: #46AB3B;
    --negative-color: #D90719;
    --neutral-color: #D4AB27;
}
```

CSS variables are pretty handy for **styling**, but not for **theming**.

## Solution 2: Stylesheet injection

The idea here is to inject a custom stylesheet in the Shadow Root of the element. This should provide enough flexibility for theming.





