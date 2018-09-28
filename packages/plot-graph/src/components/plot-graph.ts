import { ComponentBase, html, TemplateResult } from "@hmh/component-base/dist/index";
import * as d3 from "d3";

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<string> {

    private graphSize: number = 500;
    private xmin: number = 0;
    private xmax: number = 0;
    private ymax: number = 0;
    private ymin: number = 0;
    private step: number = 0;
    private equations: HTMLElement[] = [];
    private svgContainer: any = null;
    private renderedGraph: boolean = false;
    
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            xmin: Number,
            xmax: Number,
            ymin: Number,
            ymax: Number,
            step: Number
        };
    }

    // This is a mock
    private prepareValue(equation: HTMLElement, x: string) : number {
        return eval(equation.innerHTML.replace('x', x));
    }

    /*
    private scaleValToGraph(val: number) : number {
        return (this.graphSize / 100) * val;
    }*/

    protected _render({equations}: PlotGraph): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">

        <div class="container">
            <div id="canvas"></div>
        </div>

        <slot name="options" class="options" on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}" hidden> </slot>
        `;
    }

    public _didRender(): void {
        if (!this.renderedGraph && this.equations.length > 0) {
            /*.interpolate("linear");*/
            const numberPoints = (this.xmax - this.xmin / this.step);
            this.renderedGraph = true;
            this.svgContainer = d3.select(this.shadowRoot).select("#canvas").append("svg");

            // 5. X scale will use the index of our data
            const xScale = d3.scaleLinear()
            .domain([0, numberPoints-1]) // input
            .range([0, this.graphSize]); // output

            // 6. Y scale will use the randomly generate number 
            const yScale = d3.scaleLinear()
            .domain([-1, 1]) // input 
            .range([this.graphSize, 0]); // output     

            // 7. d3's line generator
            const line = d3.line()
                .x(function(d: any, i: any) { return xScale(i); }) // set the x values for the line generator
                .y(function(d: any) { return yScale(d.y); }) // set the y values for the line generator 
                .curve(d3.curveMonotoneX) // apply smoothing to the line
     
            this.equations.forEach((equation) => {
                // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
                const prepareValue = this.prepareValue;
                const dataset = d3.range(numberPoints).map(function(x: any) { return {"y": prepareValue(equation, x)}});

                this.svgContainer.attr("width", this.graphSize)
                .attr("height", this.graphSize)
                .append("g")
                .attr("transform", "translate(0,0)");

                // 3. Call the x axis in a group tag
                this.svgContainer.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + this.graphSize + ")")
                    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

                // 4. Call the y axis in a group tag
                this.svgContainer.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

                // 9. Append the path, bind the data, and call the line generator 
                this.svgContainer.append("path")
                    .datum(dataset) // 10. Binds data to the line 
                    .attr("class", "line") // Assign a class for styling 
                    .attr("d", line) // 11. Calls the line generator 
                    .style("stroke", equation.getAttribute('color')) 
            });
        }
    }

    /**
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    this.equations.push(el);
                }
            );
        }

        this.requestRender();
    }
}

customElements.define("plot-graph", PlotGraph);