# Assessment System Response Validation Component

## Usage

```html
<response-validation expected="compromise" score="4" strategy="fuzzyMatch">
    <div>Good</div>
    <div>Wooot!</div>
</response-validation>

<response-validation expected="concession" score="3" feedbackType="neutral"  strategy="exactMatch">
    <div>Alright!</div>
</response-validation>

<response-validation  score="0" feedback="negative" strategy="exactMatch" >
    <div>Try again</div>
    <div>Oups, still not good</div>
    <div>Too bad!</div>
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