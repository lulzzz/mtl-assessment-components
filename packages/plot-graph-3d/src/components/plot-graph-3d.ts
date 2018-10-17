import { html, TemplateResult, property, ComponentBase, CoordinateSystem } from '@hmh/component-base';
import { line, curveMonotoneX } from 'd3-shape';
import { range } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { Line } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { Graph2d, DataSet } from 'vis/dist/vis.js';

// This is a mock
function prepareValue(equation: HTMLElement, x: string): number {
    return eval(equation.innerHTML.replace('x', x));
}

enum Direction {
    X = 'X',
    Y = 'Y',
    Z = 'Z'
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
     * Return a d3.scale function
     *
     * @param  {Direction} axis X or Y
     * @returns d3.ScaleLinear
     */
    private scale(axis: Direction, min: number, max: number, size: number): d3.ScaleLinear<number, number> {
        const domain = [min, max];
        const range = axis === Direction.X ? [0, size] : [size, 0];
        return scaleLinear()
            .domain(domain) // input
            .range(range); // output
    }

    /**
     * @param  {d3.ScaleLinear<number, number>} xScale
     * @param  {d3.ScaleLinear<number, number>} yScale
     * @returns Returns a D3 line defined by xScale and yScale
     */
    private drawLine(xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): Line<any> {
        return line()
            .x(function(d: any, i: any) {
                return xScale(i);
            }) // set the x values for the line generator
            .y(function(d: any) {
                return yScale(d.y);
            }) // set the y values for the line generator
            .curve(curveMonotoneX); // apply smoothing to the line
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
        this.drawGraph();
    }

    /**
     * Draws an svg graph using d3, CoordinateSystem to define the axes and equation-items for the equations.
     * The SVG is attached to the 'canvas' element
     * @returns void
     */
    private drawGraph(): void {
        const aspect = 1;
        const canvas = this.shadowRoot.getElementById('canvas');
        const width = canvas.clientWidth;
        const height = Math.round(width / aspect);


        // https://chartio.com/resources/tutorials/how-to-resize-an-svg-when-the-window-is-resized-in-d3-js/
        canvas.setAttribute('width', '100%')
        canvas.setAttribute('height', '100%');

        /*
        var items = [
            {x: '2014-06-11', y: 10},
            {x: '2014-06-12', y: 25},
            {x: '2014-06-13', y: 30},
            {x: '2014-06-14', y: 10},
            {x: '2014-06-15', y: 15},
            {x: '2014-06-16', y: 30}
          ];
        
;
          var options = {
            start: '2014-06-10',
            end: '2014-06-18'
        };*/

        // plot a line for each equation
        this.equationItems.forEach(equation => {
            const equationXmin = parseInt(equation.getAttribute('equation-xmin'));
            const equationXmax = parseInt(equation.getAttribute('equation-xmax'));
            const equationYmin = parseInt(equation.getAttribute('equation-ymin'));
            const equationYmax = parseInt(equation.getAttribute('equation-ymax'));
            const step = parseInt(equation.getAttribute('step'));
            const xScale = this.scale(Direction.X, equationXmin, equationXmax, width);
            const yScale = this.scale(Direction.Y, equationYmin, equationYmax, height);
            const numberPoints = equationXmax - equationXmin / step;

            // get Y for each X (apply equation)
            const data = range(numberPoints).map(function(x: any) {
                return { y: prepareValue(equation, x) };
            });

            const graph2d = new Graph2d(canvas, new DataSet(data));
        });

        const axisOffset: number = 20;
        // trans X and Y of bottom axis
        const translationX = 'translate(0,' + (height - axisOffset) + ')';
        // trans X and Y of left axis
        const translationY = 'translate(' + axisOffset + ',0)';

        //draw the axes (assuming any have been added)
        this.axes.forEach(axis => {
            const isDirectionX = axis.getAttribute('direction').toLowerCase() === Direction.X.toString().toLowerCase();
            const min = axis.getAttribute('min');
            const max = axis.getAttribute('max');
            const scale = this.scale(axis.direction, parseInt(min), parseInt(max), isDirectionX ? width : height);
            
            this.svgContainer
                .append('g')
                .attr('class', isDirectionX ? 'x-axis' : 'y-axis')
                .attr('transform', isDirectionX ? translationX : translationY)
                .call(isDirectionX ? axisBottom(scale) : axisLeft(scale));
        });
    }
}

customElements.define('plot-graph-3d', PlotGraph3D);
