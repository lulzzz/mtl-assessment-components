import { html, TemplateResult, property, ComponentBase, CoordinateSystem } from '@hmh/component-base';

// This is a mock
function prepareValue(equation: string, x: number, y: number): number {
    return eval(equation.replace('x', x.toString()).replace('y', y.toString()));
}

/**
 * `<plot-graph-3d>`
 * Plot a graph in 3d. The equation should specficy values for x and y and will be solved for z.
 *
 * equationXmin etc are variables that bound the range of the equations.
 * step - the intervals at which points are plotted along the equation graphs.
 * @demo ./demo/plot-graph-3d.html
 *
 */
export class PlotGraph3D extends ComponentBase<any> {
    private axes: any[] = [];
    @property({ type: Array })
    protected equationItems : HTMLElement[] = [];
    @property({ type: String, attribute: 'axes-color'})
    protected axesColor: string;

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/plot-graph.css">
        <link rel="stylesheet" type="text/css" href="vis/dist/vis.min.css">
        <slot hidden name="graph-axis" @slotchange=${(evt: Event) => this._onCoordSystemAdded(evt)}> </slot>

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
        console.log('_onSlotChanged');
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;

        const equationItems: HTMLElement[] = [];
        slot.assignedNodes().forEach(
            (el: HTMLElement): void => {
                equationItems.push(el);
            }
        );

        this.equationItems = equationItems;
        this.drawGraph();
    }

    /**
     * A Coordinate System contains axis
     *
     * @param  {Event} event
     * @returns void
     */
    private _onCoordSystemAdded(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        
        const axesItems: HTMLElement[] = [];
        slot.assignedNodes().forEach(
            (coordSystem: CoordinateSystem): void => {
                console.log('coord system found');
                coordSystem.getValue().forEach((axis: any) => {
                    console.log('pushing to axes');
                    axesItems.push(axis);
                });
            }
        );

        this.axes = axesItems;
        console.log('_on coord system added calling drawGraph');
        this.drawGraph();
    }

    /**
     * Draws an svg graph using d3, CoordinateSystem to define the axes and equation-items for the equations.
     * The SVG is attached to the 'canvas' element
     * @returns void
     */
    private drawGraph(): void {
        console.log('drawGraph')
        if (this.equationItems.length <= 0) {
            console.log('drawGraph return');
            return;
        }
        console.log('drawGraph 2')
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
        const style = equation.getAttribute('render-style');

        // Create and populate a data table.
        const dataset = new vis.DataSet();
        for (let x = equationXmin; x < equationXmax; x+=step) {
            for (let y = equationYmin; y < equationYmax; y+=step) {     
                dataset.add({x:x,y:y,z:prepareValue(equation.innerText, x, y)});
            }
        }

        const options: any = {
            width:  '100%',
            height: '100%',
            style: 'surface', // default
            showPerspective: true,
            showGrid: true,
            showShadow: false,
            keepAspectRatio: true,
            verticalRatio: 0.5
        };

        if (style) {
            options['style'] = style;
        }   
        
        console.log('this.axes.length: ', this.axes.length);

        if (this.axes.length > 0) {
            console.log('drawGraph 3')
            this.axes.forEach((axis) => {
                const direction = axis.getAttribute('direction');
                const visibleVal = axis.getAttribute('axis-visibility');
                const label = axis.innerText;
                console.log('label val:', label);

                if (this.axesColor) {
                    options['axisColor'] = this.axesColor;
                }

                if (direction) {
                    console.log('drawGraph 4')
                    if (label) {
                        console.log('LABEL!');
                        options[[direction.toLowerCase(), 'Label'].join('').trim()] = label;
                    }

                    if (visibleVal) {
                        options[['show', direction.toUpperCase(), 'Axis'].join('').trim()] = (visibleVal === 'visible');
                    }

                    /* TODO: not sure why this breaks rendering
                    const min = axis.getAttribute('min'); 
                    const max = axis.getAttribute('max');

                    // set axis min and max values if specified
                    if (min) {
                        options[[direction.toLowerCase(), 'Min'].join('').trim()] = Number.parseInt(min);
                    }

                    if (max) {
                        options[[direction.toLowerCase(), 'Max'].join('').trim()] = Number.parseInt(max);
                    }
                    */
                }
            })
        }

        new vis.Graph3d(canvas, dataset, options);
    }
}

customElements.define('plot-graph-3d', PlotGraph3D);
