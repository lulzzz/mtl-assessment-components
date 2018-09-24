# Assessment System Text Input Component

## Usage

```html
<!-- basic usage -->
<drag-drop placeholder="" default="" answer="peculiarity">
</drag-drop>

<!-- advanced usage, same as above -->
<drag-drop placeholder="" default="">
    <answer-option>peculiarity</answer-option>
</drag-drop>

<!-- advanced usage, multiple answers -->
<drag-drop placeholder="" default="">
    <answer-option type="correct">peculiarity</answer-option>
    <answer-option type="correct">pecularity</answer-option>
    <answer-option>peculiarities</answer-option>
    <feedback-item type="negative" strategy="sequential">
        <b>Try again</b>
    </feedback-item>
    <feedback-item type="negative" strategy="sequential">
        <b>Almost there</b>
    </feedback-item>
    <feedback-item type="negative" strategy="sequential">
        <i>Oups</i>
    </feedback-item>
    <feedback-item type="positive" strategy="sequential">
        <b>Congrats</b> dude!
    </feedback-item>
</drag-drop>
```

## Demo page

```shell
npm start
```

## Unit tests

```shell
npm test
```