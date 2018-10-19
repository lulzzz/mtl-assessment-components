# Assessment System Text Input Component

## Usage

```html
    <drag-drop>
        <h3>Drag and drop the numbers and variables into the correct boxes to complete a function in function notation for the
            situation. Let x represent the number of hours.</h3>
        Charles will babysit for up to 4 hours and charges $8 per hour.
        <br>The function is

        <drop-container max-items="1">
            <response-validation hidden slot="feedback" expected="000-1|000-5" score="10">
                <span>Perfect</span>
            </response-validation>

            <response-validation hidden slot="feedback" expected="000-1|000-5" score="5" strategy="contains" feedback-type="neutral">
                <span>Almost</span>
            </response-validation>

            <response-validation hidden slot="feedback" score="0" feedback-type="negative">
                <span>Try again</span>
                <span>Still not good</span>
                <span>Wrong answer</span>
            </response-validation>
        </drop-container>
        =
        <drop-container max-items="1">
            <response-validation hidden slot="feedback" expected="4" score="10">
                <span>Perfect</span>
            </response-validation>

            <response-validation hidden slot="feedback" expected="2" score="5" strategy="contains" feedback-type="neutral">
                <span>Almost</span>
            </response-validation>

            <response-validation hidden slot="feedback" score="0" feedback-type="negative">
                <span>Try again</span>
                <span>Still not good</span>
                <span>Wrong answer</span>
            </response-validation>
        </drop-container>
        *
        <drop-container max-items="5">
            <response-validation hidden slot="feedback" expected="4" score="10">
                <span>Perfect</span>
            </response-validation>

            <response-validation hidden slot="feedback" score="0" feedback-type="negative">
                <span>Try again</span>
                <span>Still not good</span>
                <span>Wrong answer</span>
            </response-validation>
        </drop-container>
        <br>
        <drag-container dispenser>
            <div slot="options" id="000-1">x</div>
            <div slot="options" id="000-2">8</div>
            <div slot="options" id="000-3">f(x)</div>
            <div slot="options" id="000-4">4</div>
            <div slot="options" id="000-5">
                <img draggable="false" src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Approve_icon.svg" alt="Check image" style="width:22px;height:22px;border:0;">
            </div>
        </drag-container>
        <drag-container>
            <div slot="options" id="1">1</div>
            <div slot="options" id="2">2</div>
            <div slot="options" id="3">3</div>
            <div slot="options" id="4">4</div>
        </drag-container>
        <drag-container id="trash" max-items="1" trash></drag-container>
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
