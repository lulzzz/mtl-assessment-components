import { ComponentBase, html, TemplateResult, property } from "@hmh/component-base/dist/index";
import * as d3 from "d3";

// This is a mock
function prepareValue(equation: HTMLElement, x: string) : number {
    return eval(equation.innerHTML.replace('x', x));
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

    private graphSize: number = 500;
    private svgContainer: any = null;
    private renderedGraph: boolean = false;
    
    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">
            <div id="canvas"></div>
        <slot hidden name="options" class="options" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        `;
    }

    public updated(): void {
        if (!this.renderedGraph && this.equations.length > 0) {

            const numberPoints = (this.xmax - this.xmin / this.step);
            this.renderedGraph = true;
            this.svgContainer = d3.select(this.shadowRoot).select("#canvas").append("svg");

            const xScale = d3.scaleLinear()
            .domain([this.xmin, this.xmax]) // input
            .range([0, this.graphSize]); // output

            const yScale = d3.scaleLinear()
            .domain([this.ymin, this.ymax]) // input 
            .range([this.graphSize, 0]); // output     

            // Line generator
            const line = d3.line()
                .x(function(d: any, i: any) { return xScale(i); }) // set the x values for the line generator
                .y(function(d: any) { return yScale(d.y); }) // set the y values for the line generator 
                .curve(d3.curveMonotoneX) // apply smoothing to the line
     
            this.svgContainer
            .attr("width", this.graphSize)
            .attr("height", this.graphSize)
            .append("g")
            
            this.equations.forEach((equation) => {
                const dataset = d3.range(numberPoints).map(function(x: any) { return {"y": prepareValue(equation, x) }});

                // Append the path, bind the data, and call the line generator 
                this.svgContainer.append("path")
                    .datum(dataset) // inds data to the line 
                    .attr("class", "line") // Assign a class for styling 
                    .attr("d", line) // Calls the line generator 
                    .style("stroke", equation.getAttribute('color')) 
            });
            
            // Call the x axis in a group tag
            this.svgContainer.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (this.graphSize - 25) + ")")
                .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom
                

            // 4. Call the y axis in a group tag
            this.svgContainer.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + 25 + ",0)")
                .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
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

customElements.define("plot-graph", PlotGraph);