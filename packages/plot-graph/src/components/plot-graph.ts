import { ComponentBase, html, TemplateResult, property } from '@hmh/component-base';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { range } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

// declare const d3: any;

// This is a mock
function prepareValue(equation: HTMLElement, x: string): number {
    return eval(equation.innerHTML.replace('x', x));
}

enum Direction {
    X = 'X',
    Y = 'Y'
}

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<string> {
    @property({ type: Number })
    public xmin: number = 0;
    @property({ type: Number })
    public xmax: number = 0;
    @property({ type: Number })
    public ymax: number = 0;
    @property({ type: Number })
    public ymin: number = 0;
    @property({ type: Number })
    public step: number = 0;
    @property({ type: Array })
    private equations: HTMLElement[] = [];
    public shadowRoot: ShadowRoot;

    private graphSize: number = 500;
    private svgContainer: any = null;
    private renderedGraph: boolean = false;
    private axisSize: number = 25;

    /**
     * Return d3 line function
     *
     * @param  {any} xScale
     * @param  {any} yScale
     * @returns d3.Line
     */
    private drawLine(xScale: any, yScale: any): d3.Line<any> {
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
     * Return a d3.scale function
     *
     * @param  {Direction} axis X or Y
     * @returns d3.ScaleLinear
     */
    private scale(axis: Direction): d3.ScaleLinear<number, number> {
        const domain = axis === Direction.X ? [this.xmin, this.xmax] : [this.ymin, this.ymax];
        const range = axis === Direction.X ? [0, this.graphSize] : [this.graphSize, 0];

        return scaleLinear()
            .domain(domain) // input
            .range(range); // output
    }

    /**
     * Add an axis to svgContainer (the graph)
     *
     * @param  {Direction} axis
     * @param  {d3.ScaleLinear<number} scale
     * @param  {} number>
     * @returns void
     */
    private addAxis(axis: Direction, scale: d3.ScaleLinear<number, number>): void {
        const translationX = 'translate(0,' + (this.graphSize - this.axisSize) + ')';
        const translationY = 'translate(' + this.axisSize + ',0)';

        // Call the x axis in a group tag
        this.svgContainer
            .append('g')
            .attr('class', axis === Direction.X ? 'x-axis' : 'y-axis')
            .attr('transform', axis === Direction.X ? translationX : translationY)
            .call(axis === Direction.X ? axisBottom(scale) : axisLeft(scale)); // Create an axis component with d3.axisBottom
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" href="/css/plot-graph.css">
        <div id="canvas"></div>
        <slot hidden name="options" class="options" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}></slot>
        `;
    }

    /**
     * Called after rendering (graph and lines generated here).
     *
     * @returns void
     */
    public updated(): void {
        if (!this.renderedGraph && this.equations.length > 0) {
            const numberPoints = this.xmax - this.xmin / this.step;
            this.renderedGraph = true;
            this.svgContainer = select(this.shadowRoot)
                .select('#canvas')
                .append('svg');

            const xScale = this.scale(Direction.X);
            const yScale = this.scale(Direction.Y);

            this.svgContainer
                .attr('width', this.graphSize)
                .attr('height', this.graphSize)
                .append('g');

            // plot a line for each equation
            this.equations.forEach(equation => {
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

            // Call the X and Y axes in a group tag
            this.addAxis(Direction.X, xScale);
            this.addAxis(Direction.Y, yScale);
        }
    }

    /**
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const equations: HTMLElement[] = [];
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    equations.push(el);
                }
            );

            this.equations = equations;
        }
    }
}

customElements.define('plot-graph', PlotGraph);
