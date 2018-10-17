import { html, TemplateResult, property, ComponentBase, CoordinateSystem } from '@hmh/component-base';
// import { range } from 'd3-array';

// This is a mock
function prepareValueY(equation: HTMLElement, x: string): number {
    return eval(equation.innerHTML.replace('x', x));
}

function prepareValueZ(x: number, y: number): number {
    return (Math.sin(x/50) * Math.cos(y/50) * 50 + 50);
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

        const equation = this.equationItems[0];

        const equationXmin = parseInt(equation.getAttribute('equation-xmin'));
        const equationXmax = parseInt(equation.getAttribute('equation-xmax'));
        const equationYmin = parseInt(equation.getAttribute('equation-ymin'));
        const equationYmax = parseInt(equation.getAttribute('equation-ymax'));
        const step = parseInt(equation.getAttribute('step'));
        // const numberPoints = equationXmax - equationXmin / step;

        // Create and populate a data table.
        const dataset = new vis.DataSet();

        for (let x = equationXmin; x < equationXmax; x+=step) {
            for (let y = equationYmin; y < equationYmax; y+=step) {
                let z = prepareValueZ(x, y);
                dataset.add({x:x,y:y,z:z});
            }
        }

        console.log('dataset:', dataset);

        // specify options
        const options = {
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
