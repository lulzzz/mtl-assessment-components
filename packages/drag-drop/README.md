# Assessment System Text Input Component

## Usage

```html
<drag-drop>
    <drag-container>
        <div slot="options" id="000-1">x</div>
        <div slot="options" id="000-2">8</div>
        <div slot="options" id="000-3">f(x)</div>
        <div slot="options" id="000-4">4</div>
        <div slot="options" id="000-5">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Approve_icon.svg" alt="Check image" style="width:42px;height:42px;border:0;">
        </div>
    </drag-container>
    <drag-container>
        <div slot="options" id="1">1</div>
        <div slot="options" id="2">2</div>
        <div slot="options" id="3">3</div>
        <div slot="options" id="4">4</div>
    </drag-container>

    <drop-container maxItems="4">

        <response-validation hidden slot="feedback" expected="000-1|000-5" score="10">
            <span>Perfect</span>
        </response-validation>

        <response-validation hidden slot="feedback" expected="000-1|000-5" score="5" strategy="contains" feedback-type="neutral">
            <span>Almost</span>
        </response-validation>

        <response-validation hidden slot="feedback" score="0" feedback="negative">
            <span>Try again</span>
            <span>Still not good</span>
            <span>Wrong answer</span>
        </response-validation>
    </drop-container>

    <drop-container maxItems="1">
        <response-validation hidden slot="feedback" expected="4" score="10">
            <span>Perfect</span>
        </response-validation>

        <response-validation hidden slot="feedback" expected="2" score="5" strategy="contains" feedback-type="neutral">
            <span>Almost</span>
        </response-validation>

        <response-validation hidden slot="feedback" score="0" feedback="negative">
            <span>Try again</span>
            <span>Still not good</span>
            <span>Wrong answer</span>
        </response-validation>
    </drop-container>

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
