# Assessment System Response Validation Component

## Usage

```html
<response-validation matches="compromise" score="4" feedback="positive" strategy="fuzzyMatch">
    <div slot="feedback">Good job!</div>
</response-validation>

<response-validation matches="concession" score="3" feedback="neutral"  strategy="exactMatch">
    <div slot="feedback">Alright!</div>
</response-validation>

<response-validation  score="0" feedback="negative" strategy="exactMatch" >
    <div slot="feedback">Try again</div>
    <div slot="feedback">Oups, still not good</div>
    <div slot="feedback">Too bad!</div>
</response-validation>
```

## Demo page

```shell
npm start
```

## Important notice

Both `<div>` and `<span>` are supported to define option items.

* Use `<div>` for block-level interactions.
* Use `<span>` for inline interactions. Interactions that are inlined within paragraphs, don't support slotting divs.