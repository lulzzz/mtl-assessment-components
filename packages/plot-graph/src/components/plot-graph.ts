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
    private yMin: number = 0;
    private yMax: number = 0;
    private step: number = 0;
    private equations: string[] = [];
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
    private prepareValue(equation: string, x: number, y?: number) : number {
        const evalMe = equation.replace('x', x.toString());
        console.log('prepareValue:', evalMe);
        return eval(evalMe);
    }

    private scaleValToGraph(val: number) : number {
        return (this.graphSize / 100) * val;
    }

    //This is the accessor function we talked about above
    private getPoints(equation: string): Object[] {
        let points: Object[] = [];

        for (let x = this.xmin; x <= this.xmax; x+=this.step) {
            const y = this.prepareValue(equation, x);
            points.push({ x: this.scaleValToGraph(x), y: this.scaleValToGraph(y) });
        }

        return points;
    }

    protected _render({equations}: PlotGraph): TemplateResult {
        console.log('render', Date.now());
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">

        <div class="container">
            <div id="canvas"></div>
        </div>

        <slot name="options" class="options" on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}" hidden> </slot>
        `;
    }

    public _didRender(): void {
        console.log('_didRender:', Date.now());
        if (!this.renderedGraph && this.equations.length > 0) { //hacky badness
            /*.interpolate("linear");*/
            let numberPoints = 360;
            this.renderedGraph = true;
            this.svgContainer = d3.select(this.shadowRoot).select("#canvas").append("svg");

            //TODO: typescript and per expression and dataset from expression


            // 5. X scale will use the index of our data
            var xScale = d3.scaleLinear()
            .domain([0, numberPoints-1]) // input
            .range([0, this.graphSize]); // output

            // 6. Y scale will use the randomly generate number 
            var yScale = d3.scaleLinear()
            .domain([-1, 1]) // input 
            .range([this.graphSize, 0]); // output           
            
            // 7. d3's line generator
            var line = d3.line()
                .x(function(d: any, i: any) { return xScale(i); }) // set the x values for the line generator
                .y(function(d: any) { return yScale(d.y); }) // set the y values for the line generator 
                .curve(d3.curveMonotoneX) // apply smoothing to the line            

            // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
            var dataset = d3.range(numberPoints).map(function(d: any) { return {"y": Math.sin(d/30) } })

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
                .attr("d", line); // 11. Calls the line generator 
        }
    }

    /**
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        console.log('_onSlotChanged:', Date.now());
        const equationsElems: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    equationsElems.push(el);
                }
            );
        }

        equationsElems.forEach((equationElem) => {
            this.equations.push(equationElem.innerHTML);
        });

        this.requestRender();
    }
}

customElements.define("plot-graph", PlotGraph);