# Assessment System Text Input Component

## Usage

```html
<!-- basic usage -->
            <plot-graph xmin="0" xmax="360" ymin="-10" ymax="10" step="1">

                <axis-def slot="graph-axis">
                    <div slot="axis" color="red" direction="x" min="-10" max="10" axisVisibility="visible" scaleVisibility="visible" otherAxesCrossingPoint="0">some label</div>
                    <div slot="axis" color="green" direction="y" min="-10" max="10" axisVisibility="visible" scaleVisibility="visible" otherAxesCrossingPoint="0">some label</div>
                </axis-def>

                <div slot="options" class="option-item" color="red""> Math.sin(x/30) </div>

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