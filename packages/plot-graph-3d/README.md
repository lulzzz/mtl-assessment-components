# Assessment System Text Input Component

## Usage

```html
<!-- basic usage -->
    <plot-graph-3d>
        <coordinate-system slot="graph-axis">
            <div slot="axis" color="red" direction="x" min="-5" max="5" axis-visibility="visible" scale-visibility="visible" other-axes-crossing-point="0">some label</div>
            <div slot="axis" color="green" direction="y" min="-5" max="5" axis-visibility="visible" scale-visibility="visible" other-axes-crossing-point="0">some label</div>
        </coordinate-system>

        <div slot="equation-items" class="equation-item" color="red" equation-xmin="0" equation-xmax="360" equation-ymin="-10" equation-ymax="10" step="1">Math.sin(x/30)</div>
        <div slot="equation-items" class="equation-item" color="blue" equation-xmin="0" equation-xmax="360" equation-ymin="-10" equation-ymax="10" step="1">Math.cos(x/30)</div>
    </plot-graph-3d>
```

## Demo page

```shell
npm start
```

## Unit tests

```shell
npm test
```