# Assessment System Text Input Component

## Usage (2D)

```html
<!-- basic usage -->
    <plot-graph>
        <coordinate-system slot="graph-axis">
            <div slot="axis" color="red" direction="x" min="-5" max="5" axis-visibility="visible" scale-visibility="visible" other-axes-crossing-point="0">some label</div>
            <div slot="axis" color="green" direction="y" min="-5" max="5" axis-visibility="visible" scale-visibility="visible" other-axes-crossing-point="0">some label</div>
        </coordinate-system>

        <div slot="equation-items" class="equation-item" color="red" equation-xmin="0" equation-xmax="360" equation-ymin="-10" equation-ymax="10" step="1">Math.sin(x/30)</div>
        <div slot="equation-items" class="equation-item" color="blue" equation-xmin="0" equation-xmax="360" equation-ymin="-10" equation-ymax="10" step="1">Math.cos(x/30)</div>
    </plot-graph>
```

## Usage (3D)

```html
<!-- basic usage -->
        <plot-graph-3d axes-color="gray">
            <coordinate-system slot="graph-axis">
                <div slot="axis" color="red" direction="x" min="0" max="360" axis-visibility="visible">label x</div>
                <div slot="axis" color="green" direction="y" min="0" max="360" axis-visibility="visible">label y</div>
                <div slot="axis" color="blue" direction="z" min="0" max="360" axis-visibility="visible">label z</div>
            </coordinate-system>

            <span slot="equation-items" class="equation-item" equation-xmin="0" equation-xmax="360" equation-ymin="0" equation-ymax="360" step="10" render-style="surface">Math.sin(x/50) * Math.cos(y/50) * 50 + 50</span>
        </plot-graph-3d>
```

## attributes (3D)

```
'render-style' options are:
bar, bar-color, bar-size, dot, dot-line, dot-color, dot-size, line, grid, or surface

'equation-zmin' and 'equation-zmax' are optional
```


## Demo page

```shell
npm start
```

## Unit tests

```shell
npm test
```