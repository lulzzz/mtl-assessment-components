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
        return eval(evalMe);
    }

    private scaleValToGraph(val: number) : number {
        return (this.graphSize / 100) * val;
    }

//This is the accessor function we talked about above
    private getPoints(equation: string): string {
        let results: string = '';

        for (let x = this.xmin; x <= this.xmax; x+=this.step) {
            const y = this.prepareValue(equation, x);
            // results.push({"x": x, "y": y});
            // console.log('x: ', x, ' y: ', y);
            results+=`${this.scaleValToGraph(x).toString()},${this.scaleValToGraph(y).toString()}`;
        }

        return results;
    }

    public _didRender(): void {
        console.log('_didRender:', Date.now());
        
        if (!this.renderedGraph && this.equations.length > 0) { //hacky badness
            /*
            let lineFunction = d3.svg.line()
            .x(function(d: any) { return d.x; })
            .y(function(d: any) { return d.y; })
            .interpolate("linear");*/

            this.renderedGraph = true;
            this.svgContainer = d3.select(this.shadowRoot).select("#canvas").append("svg").attr("width", this.graphSize).attr("height", this.graphSize);

            this.equations.forEach((equation) => {
                const points = this.getPoints(equation);
                /*
                this.svgContainer.append("path")
                                            .attr("d", lineFunction(points))
                                            .attr("stroke", "blue")
                                            .attr("stroke-width", 2)
                                            .attr("fill", "none");

                */
                console.log('points: ', points);
                this.svgContainer.append("polyline")
                .attr("points", points)
                .attr("stroke-width", 1)
                .attr("stroke", 'red');                
            });
        }
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