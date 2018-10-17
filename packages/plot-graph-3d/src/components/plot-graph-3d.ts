import { html, TemplateResult, property, ComponentBase, CoordinateSystem } from '@hmh/component-base';
// import { range } from 'd3-array';

// This is a mock
function prepareValue(equation: HTMLElement, x: string): number {
    return eval(equation.innerHTML.replace('x', x));
}


/**
 * `<plot-graph-3d>`
 * Plot a graph 3d using component-base CoordinateSystem to define the axes and equation-items for the equations
 *
 * equationXmin etc are variables the bound the range of the equations (independently of the axis dimensions)
 * step - the intervals at which points are plotted along the equation graphs
 * @demo ./demo/index.html
 *
 */
export class PlotGraph3D extends ComponentBase<any> {
    private axes: any[] = [];
    protected svgContainer: any = null;
    @property({ type: Array })
    protected equationItems: HTMLElement[] = [];

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/plot-graph-3d.css">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.css">
        
        <div class="container">
            <div id="canvas"></div>
        </div>

        <slot hidden name="graph-axis" @slotchange=${(evt: Event) => this._onCoordSystemAdded(evt)}> </slot>
        <slot hidden name="equation-items" class="equations" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        `;
    }

    /**
     * Fired when equations are added
     *
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const equationItems: HTMLElement[] = [];
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    equationItems.push(el);
                }
            );

            this.equationItems = equationItems;
            this.drawGraph();     
        }
    }

    /**
     * A Coordinate System contains axis
     *
     * @param  {Event} event
     * @returns void
     */
    private _onCoordSystemAdded(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (coordSystem: CoordinateSystem): void => {
                    coordSystem.getValue().forEach((axis: any) => {
                        this.axes.push(axis);
                    });
                }
            );
        }
        // in case axes are added after the equations
        // this.drawGraph();
    }

    /**
     * Draws an svg graph using d3, CoordinateSystem to define the axes and equation-items for the equations.
     * The SVG is attached to the 'canvas' element
     * @returns void
     */
    private drawGraph(): void {
        const canvas = this.shadowRoot.getElementById('canvas');

        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }

        // Create and populate a data table.
        var dataset = new vis.DataSet();
        // create some nice looking data with sin/cos
        var counter = 0;
        var steps = 50;  // number of datapoints will be steps*steps
        var axisMax = 314;
        var axisStep = axisMax / steps;
        for (var x = 0; x < axisMax; x+=axisStep) {
            for (var y = 0; y < axisMax; y+=axisStep) {
                var value = (Math.sin(x/50) * Math.cos(y/50) * 50 + 50);
                dataset.add({id:counter++,x:x,y:y,z:value,style:value});
            }
        }

        console.log('dataset:', dataset);

        // specify options
        var options = {
            width:  '500px',
            height: '500px',
            style: 'surface',
            showPerspective: true,
            showGrid: true,
            showShadow: false,
            keepAspectRatio: true,
            verticalRatio: 0.5
        };


        const graph3d = new vis.Graph3d(canvas, dataset, options);
    }
}

customElements.define('plot-graph-3d', PlotGraph3D);
