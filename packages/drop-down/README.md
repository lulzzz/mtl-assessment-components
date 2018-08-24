# Assessment System Drop Down Component

## Usage

```html
<!-- basic usage -->
<drop-down placeholder="" default="">
    <answer-option>one</answer-option>
    <answer-option>two</answer-option>
    <answer-option type="correct">three</answer-option>
</drop-down>

<!-- with feedback -->
<drop-down placeholder="" default="">
    <answer-option>one</answer-option>
    <answer-option>two</answer-option>
    <answer-option type="correct">three</answer-option>
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
</drop-down>

```

## Demo page

```shell
npm start
```

## Unit tests

```shell
npm test
```