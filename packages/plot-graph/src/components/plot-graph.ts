import { html, TemplateResult, property, GraphBase, Direction } from '@hmh/component-base/dist/index';
import * as d3 from 'd3';

// This is a mock
function prepareValue(equation: HTMLElement, x: string): number {
    return eval(equation.innerHTML.replace('x', x));
}

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends GraphBase {
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

    private svg: any;

    /**
     * Return d3 line function
     * 
     * @param  {any} xScale
     * @param  {any} yScale
     * @returns d3.Line
     */
    private drawLine(xScale: any, yScale: any): d3.Line<any> {
        return d3.line()
            .x(function(d: any, i: any) {
                return xScale(i);
            }) // set the x values for the line generator
            .y(function(d: any) {
                return yScale(d.y);
            }) // set the y values for the line generator
            .curve(d3.curveMonotoneX); // apply smoothing to the line
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">
            <div id="canvas"></div>
        <slot hidden name="options" class="options" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        <slot name="graph-axis" @slotchange=${(evt: Event) => this._onAxisAdded(evt)}> </slot>
        `;
    }

    private _onAxisAdded(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const axisElements: any[] = [];
            slot.assignedNodes().forEach(
                (el: any): void => {
                    axisElements.push(el);
                }
            );

            console.log('_onAxisAdded:', axisElements[0].value._groups[0]);
            this.svg = axisElements[0].value;
        }
    }

    /**
     * Called after rendering (graph and lines generated here).
     * 
     * @returns void
     */
    public updated(): void {
        console.log('updated');
        console.log('items:', this.items);
        console.log('rendered:', this.rendered);

        if (!this.rendered && this.items.length > 0) {
            const numberPoints = this.xmax - this.xmin / this.step;
            this.rendered = true;

            const xScale = this.scale(Direction.X, this.xmin, this.xmax);
            const yScale = this.scale(Direction.Y, this.ymin, this.ymax);

            this.svgContainer = d3
                .select(this.shadowRoot)
                .select('#canvas');

            this.svgContainer._groups[0] = this.svg;
            //.append('svg');
            
            this.svgContainer
                .attr('width', this.graphSize)
                .attr('height', this.graphSize)
                .append('g');

            // plot a line for each equation
            this.items.forEach(equation => {
                // get Y for each X (apply equation)
                const dataset = d3.range(numberPoints).map(function(x: any) {
                    return { y: prepareValue(equation, x) };
                });

                console.log('draw line');
                // Append the path, bind the data, and call the line generator
                this.svgContainer
                    .append('path')
                    .datum(dataset) // inds data to the line
                    .attr('class', 'line') // Assign a class for styling
                    .attr('d', this.drawLine(xScale, yScale)) // Calls the line generator
                    .style('stroke', equation.getAttribute('color'));
            });

            // this.shadowRoot.querySelector('#canvas').appendChild(this.svgContainer.select('#canvas'));
        }
    }
}

customElements.define('plot-graph', PlotGraph);
