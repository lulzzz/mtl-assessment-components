import { html, TemplateResult, property, GraphBase, Direction } from '@hmh/component-base';
import { line, curveMonotoneX } from 'd3-shape';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { AxisDef } from './axis-def';
// import { axisBottom, axisLeft } from 'd3-axis';
import { Line } from 'd3-shape';
import { _3d } from 'd3-3d/index.js';

// This is a mock
function prepareValue(equation: HTMLElement, x: string): number {
    return eval(equation.innerHTML.replace('x', x));
}

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends GraphBase {
    private axes: any[] = [];

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

    private drawGrid(startAngle: number, scale: number): any{
        return _3d()
        .shape('GRID', 20)
        .origin(origin)
        .rotateY( startAngle)
        .rotateX(-startAngle)
        .scale(scale);
    }

    private _onAxisDefAdded(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (axisDef: AxisDef): void => {
                    // Because axis def has a top level container (with it's own slotted axes inside)
                    axisDef.getValue().forEach((axis: any) => {
                        this.axes.push(axis);
                    });   
                }
            );
        }
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/plot-graph.css">
            <div id="canvas"></div>
        <slot hidden name="options" class="options" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        <slot name="graph-axis" @slotchange=${(evt: Event) => this._onAxisDefAdded(evt)}> </slot>
        `;
    }

    /**
     * Called after rendering (graph and lines generated here).
     *
     * @returns void
     */
    public updated(): void {
        if (!this.rendered && this.items.length > 0) {
            this.rendered = true;
            const numberPoints = this.xmax - this.xmin / this.step;
            
            this.svgContainer = select(this.shadowRoot).select('#canvas')
            .append('svg')
            .attr('width', this.graphSize)
            .attr('height', this.graphSize)
            .append('g');

            const xScale = this.scale(Direction.X, this.xmin, this.xmax);
            const yScale = this.scale(Direction.Y, this.ymin, this.ymax);

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

            this.svgContainer.attr('d', this.drawGrid(90, 20).draw);
            

            //draw the axes (assuming any have been added)
            /*
            this.axes.forEach((axis) => {
                this.svgContainer
                .append('g')
                .attr('class', axis.direction === Direction.X ? 'x-axis' : 'y-axis')
                .attr('transform', axis.direction === Direction.X ?axis.translationX : axis.translationY )
                .call(axis.direction === Direction.X ? axisBottom(axis.scale) : axisLeft(axis.scale)); // Create an axis component with d3.axisBottom
            });*/
        }
    }
}

customElements.define('plot-graph', PlotGraph);
