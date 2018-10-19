# Assessment System Drop Down Component

##  Usage

```html
<!-- basic usage -->
<drop-down id="drop-down1">
    <div slot="options" class="option-item", id="one">one</div>
    <div slot="options" class="option-item", id="two">two</div>
    <div slot="options" class="option-item", id="three">three</div>

    <response-validation slot="feedback" expected="one" score="4" strategy="exactMatch">
        <span>Correct</span>
    </response-validation>

    <response-validation slot="feedback" expected="two" score="2" feedback-type="neutral" strategy="exactMatch">
        <span>Almost Correct</span>
    </response-validation>

    <response-validation slot="feedback" score="0" feedback-type="negative" strategy="exactMatch">
        <span>Try again</span>
        <span>Oups, still not good</span>
        <span>Too bad!</span>
    </response-validation>
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