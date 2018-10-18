import { html, TemplateResult, property, ComponentBase } from '@hmh/component-base';

// This is a mock
function prepareValue(equation: string, x: string, y: string, min: number, max: number): number {
    const result = eval(equation.replace('x', x).replace('y', y));

    return (result >= min && result <= max) ? result: Number.POSITIVE_INFINITY;
}

/**
 * `<plot-graph-3d>`
 * Plot a graph in 3d. The equation should specficy values for x and y and will be solved for z.
 *
 * equationXmin etc are variables that bound the range of the equations.
 * step - the intervals at which points are plotted along the equation graphs.
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
        
        <span class="container">
            <span id="canvas"></span>
        </span>

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
        const equationZmin = parseInt(equation.getAttribute('equation-zmin'));
        const equationZmax = parseInt(equation.getAttribute('equation-zmax'));
        const equationText: string =  equation.innerText;

        const step = parseInt(equation.getAttribute('step'));

        // Create and populate a data table.
        const dataset = new vis.DataSet();
        for (let x = equationXmin; x < equationXmax; x+=step) {
            for (let y = equationYmin; y < equationYmax; y+=step) {       
                const z = prepareValue(equationText, x.toString(), y.toString(), equationZmin, equationZmax);
                if (z != Number.POSITIVE_INFINITY) {
                    dataset.add({x:x,y:y,z:z});
                }
            }
        }

        const options = {
            width:  '100%',
            height: '100%',
            style: 'surface',
            showPerspective: true,
            showGrid: true,
            showShadow: false,
            keepAspectRatio: true,
            verticalRatio: 0.5
        };

        new vis.Graph3d(canvas, dataset, options);
    }
}

customElements.define('plot-graph-3d', PlotGraph3D);
