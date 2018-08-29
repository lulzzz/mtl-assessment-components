# Assessment System Multiple Choice Component

## Usage

```html
<!-- single answer usage -->
<multiple-choice>
    <div slot="option" id="000-1">three</div>
    <div slot="option" id="000-2">five</div>
    <div slot="option" id="000-3">six</div>
    <div slot="option" id="000-4">eleven</div>
</multiple-choice>
<!-- multiple answer usage -->
<multiple-choice multiple >
    <div slot="option" id="000-1">three</div>
    <div slot="option" id="000-2">five</div>
    <div slot="option" id="000-3">six</div>
    <div slot="option" id="000-4">eleven</div>
</multiple-choice>

<!-- with feedback -->
<multiple-choice placeholder="" default="">
    <div slot="option" id="000-1">three</div>
    <div slot="option" id="000-2">five</div>
    <div slot="option" id="000-3">six</div>
    <div slot="option" id="000-4">eleven</div>
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
</multiple-choice>
```

## Demo page

```shell
npm start
```

## Unit tests

```shell
npm test
```
