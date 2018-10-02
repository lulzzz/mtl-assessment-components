# Assessment System Text Input Component

## Usage

```html
<!-- basic usage -->
    <plot-graph xValues='0,100' equation='y=x'>
        <response-validation slot="feedback" expected="y=x" score="4" strategy="fuzzyMatch">
            <span>Good</span>
            <span>Wooot!</span>
        </response-validation>

        <response-validation slot="feedback" score="0" feedback="negative" strategy="exactMatch">
            <span>Try again</span>
            <span>Oups, still not good</span>
            <span>Too bad!</span>
        </response-validation>
    </plot-graph>
```

## Demo page

```shell
npm start
```

## Unit tests

```shell
npm test
```