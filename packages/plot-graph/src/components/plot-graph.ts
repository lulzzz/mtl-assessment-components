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
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<any> {
    private axes: any[] = [];
    private axisSize: number = 25;
    protected graphSize: number = 500;
    protected svgContainer: any = null;
    protected rendered: boolean = false;
    @property({ type: Array })
    protected items: HTMLElement[] = [];
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
    private scale(axis: Direction, min: number, max: number): d3.ScaleLinear<number, number> {
        const domain = [min, max];
        const range = (axis === Direction.X ? [0, this.graphSize] : [this.graphSize, 0]);
        return scaleLinear()
            .domain(domain) // input
            .range(range); // output
    }

    /**
     * Return d3 line function
     *
     * @param  {any} xScale
     * @param  {any} yScale
     * @returns d3.Line
     */
    private drawLine(xScale: any, yScale: any): Line<any> {
        return line()
            .x(function(d: any, i: any) {
                return xScale(i);
            }) // set the x values for the line generator
            .y(function(d: any) {
                return yScale(d.y);
            }) // set the y values for the line generator
            .curve(curveMonotoneX); // apply smoothing to the line
    }

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
    * Fired on slot change
    * @param {Event} event
    */
   protected _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const items: HTMLElement[] = [];
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    items.push(el);
                }
            );

            this.items = items;
        }

        console.log('items;', this.items);
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/plot-graph.css">
        <div id="canvas"></div>
        <slot hidden name="options" class="options" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        <slot hidden name="graph-axis" @slotchange=${(evt: Event) => this._onCoordSystemAdded(evt)}> </slot>
        `;
    }

    /**
     * Called after rendering (graph and lines generated here).
     *
     * @returns void
     */
    public updated(): void {
        console.log('updated rendered: ', this.rendered, 'this.items.length: ', this.items.length);
        if (!this.rendered && this.items.length > 0) {
            console.log('updated');
            this.rendered = true;
            const numberPoints = this.equationXmax - this.equationXmin / this.step;
            
            this.svgContainer = select(this.shadowRoot).select('#canvas')
            .append('svg')
            .attr('width', this.graphSize)
            .attr('height', this.graphSize)
            .append('g');

            const xScale = this.scale(Direction.X, this.equationXmin, this.equationXmax);
            const yScale = this.scale(Direction.Y, this.equationYmin, this.equationYmax);

            // plot a line for each equation
            this.items.forEach(equation => {
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

            const translationX = 'translate(0,' + (this.graphSize - this.axisSize) + ')';
            const translationY = 'translate(' + this.axisSize + ',0)';

            //draw the axes (assuming any have been added)
            this.axes.forEach((axis) => {
                const min = axis.getAttribute('min');
                const max = axis.getAttribute('max');
                const scale = this.scale(axis.direction, parseInt(min), parseInt(max));
                const isDirectionX = axis.getAttribute('direction').toLowerCase() === Direction.X.toString().toLowerCase();

                this.svgContainer
                .append('g')
                .attr('class', isDirectionX ? 'x-axis' : 'y-axis')
                .attr('transform', isDirectionX ? translationX : translationY )
                .call(isDirectionX ? axisBottom(scale) : axisLeft(scale));
            });
        }
    }
}

customElements.define('plot-graph', PlotGraph);
