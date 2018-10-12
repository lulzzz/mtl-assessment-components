import { html, TemplateResult, property, ComponentBase, CoordinateSystem } from '@hmh/component-base';
import { line, curveMonotoneX } from 'd3-shape';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { Line } from 'd3-shape';
import { scaleLinear } from 'd3-scale';

// This is a mock
function prepareValue(equation: HTMLElement, x: string): number {
    return eval(equation.innerHTML.replace('x', x));
}

enum Direction {
    X = 'X',
    Y = 'Y',
    Z = 'Z'
};

/**
 * `<plot-graph>`
 * Plot a graph using component-base CoordinateSystem to define the axes and equation-items for the equations
 *
 * equationXmin etc are variables the bound the range of the equations (independently of the axis dimensions)
 * step - the intervals at which points are plotted along the equation graphs
 * @demo ./demo/index.html
 *
 */
export class PlotGraph extends ComponentBase<any> {
    private axes: any[] = [];
    protected svgContainer: any = null;
    protected graphDrawn: boolean = false;
    @property({ type: Array })
    protected equationItems: HTMLElement[] = [];
    @property({ type: Number, attribute:'equation-xmin'})
    public equationXmin: number = 0;
    @property({ type: Number, attribute:'equation-xmax'})
    public equationXmax: number = 10;
    @property({ type: Number, attribute:'equation-ymax'})
    public equationYmax: number = 10;
    @property({ type: Number, attribute:'equation-ymin'})
    public equationYmin: number = 0;
    @property({ type: Number })
    public step: number = 1;
    @property({ type: Array })

    /**
     * Return a d3.scale function
     *
     * @param  {Direction} axis X or Y
     * @returns d3.ScaleLinear
     */
    private scale(axis: Direction, min: number, max: number, size: number): d3.ScaleLinear<number, number> {
        const domain = [min, max];
        const range = (axis === Direction.X ? [0, size] : [size, 0]);
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
        }
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/plot-graph.css">
        <div class="canvas" id="canvas"></div>
        <slot hidden name="equation-items" class="equations" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        <slot hidden name="graph-axis" @slotchange=${(evt: Event) => this._onCoordSystemAdded(evt)}> </slot>
        `;
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

        // wipe existing graph before redrawing
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }

        this.svgContainer = select(this.shadowRoot).select('.canvas')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style("width", "100%")
        .style("height", "100%")
        .append('g');

        const xScale = this.scale(Direction.X, this.equationXmin, this.equationXmax, width);
        const yScale = this.scale(Direction.Y, this.equationYmin, this.equationYmax, height);

        const numberPoints = this.equationXmax - this.equationXmin / this.step;

        // plot a line for each equation
        this.equationItems.forEach(equation => {
            // get Y for each X (apply equation)
            const dataset = range(numberPoints).map(function(x: any) {
                return { y: prepareValue(equation, x) };
            });

            // Append the path, bind the data, and call the line generator
            this.svgContainer
            .append('path')
            .datum(dataset) // inds data to the line
            .attr('class', 'line') // Assign a class for styling
            .attr('d', this.drawLine(xScale, yScale)) // Calls the line generator
            .style('stroke', equation.getAttribute('color'));
        });

        const axisOffset: number = 20;
        // trans X and Y of bottom axis
        const translationX = 'translate(0,' + (height - axisOffset) + ')'; 
        // trans X and Y of left axis
        const translationY = 'translate(' + axisOffset + ',0)';

        //draw the axes (assuming any have been added)
        this.axes.forEach((axis) => {
            const isDirectionX = axis.getAttribute('direction').toLowerCase() === Direction.X.toString().toLowerCase();
            const min = axis.getAttribute('min');
            const max = axis.getAttribute('max');
            const scale = this.scale(axis.direction, parseInt(min), parseInt(max), isDirectionX ? width : height);
        
            this.svgContainer
            .append('g')
            .attr('class', isDirectionX ? 'x-axis' : 'y-axis')           
            .attr('transform', isDirectionX ? translationX : translationY )
            .call(isDirectionX ? axisBottom(scale) : axisLeft(scale));
        });
    }

    /**
     * Called after rendering (graph axis and lines generated as an SVG and added to the canvas here ).
     *
     * @returns void
     */
    public updated(): void {

        // render first after equationItems have been added
        if (!this.graphDrawn && this.equationItems.length > 0) {
            this.graphDrawn = true;
            this.drawGraph();
        }
    }
}

customElements.define('plot-graph', PlotGraph);
