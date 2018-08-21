# Assessment System Text Input Component

## Usage

```html
<!-- basic usage -->
<text-input placeholder="" default="" answer="peculiarity">
</text-input>

<!-- advanced usage, same as above -->
<text-input placeholder="" default="">
    <answer-option>peculiarity</answer-option>
</text-input>

<!-- advanced usage, multiple answers -->
<text-input placeholder="" default="">
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
</text-input>
```

## Demo page

```shell
npm start
```

## Unit tests

```shell
npm test
```