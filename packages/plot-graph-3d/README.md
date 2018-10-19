# Assessment System Text Input Component

## Usage

```html
<!-- basic usage -->
    <plot-graph-3d>
        <span slot="equation-items" class="equation-item" equation-xmin="0" equation-xmax="360" equation-ymin="0" equation-ymax="360" equation-zmin="0" equation-zmax="100" step="1" render-style="dot">Math.sin(x/50) * Math.cos(y/50) * 50 + 50</span>
    </plot-graph-3d>
```

## attributes

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