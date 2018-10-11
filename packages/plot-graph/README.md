# Assessment System Text Input Component

## Usage

```html
<!-- basic usage -->
    <plot-graph equation-xmin="0" equation-xmax="360" equation-ymin="-10" equation-ymax="10" step="1">

        <coordinate-system slot="graph-axis">
            <div slot="axis" color="red" direction="x" min="-5" max="5" axis-visibility="visible" scale-visibility="visible" other-axes-crossing-point="0">some label</div>
            <div slot="axis" color="green" direction="y" min="-5" max="5" axis-visibility="visible" scale-visibility="visible" other-axes-crossing-point="0">some label</div>
        </coordinate-system>

        <div slot="equation-items" class="equation-item" color="red"> Math.sin(x/30) </div>

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