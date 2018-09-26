import { ComponentBase, html, TemplateResult } from "@hmh/component-base/dist/index";
import * as d3 from "d3";

class Line {
    private static _nullValue: number = -10000;
    private _startX: number = Line._nullValue;
    private _endX: number = Line._nullValue;
    private _startY: number = Line._nullValue;
    private _endY: number = Line._nullValue;

    get startX(): number {
        return this._startX;
    }
    get endX(): number {
        return this._endX;
    }
    get startY(): number {
        return this._startY;
    }
    get endY(): number {
        return this._endY;
    }

    constructor(x1?: number, x2?: number, y1?: number, y2?: number) {
        this._startX = x1;
        this._endX = x2;
        this._startY = y1;
        this._endY = y2;
    }

    toString(): string {
        return 'X: ' + this.startX.toString() + ' to ' + this.endX.toString() + 
        ' Y: ' + this.startY.toString() + ' to ' + this.endY.toString();
    }
}

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<string> {
    private xValues: string;
    private equation: string;

    private yMin: number = 0;
    private graphSize: number = 500;
    private yMax: number = 100; // this.graphSize;
    private lineDescription: string = '';

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            disableInput: Boolean,
            placeholderText: String,
            textFieldDisabled: Boolean,
            xValues: String,
            equation: String,
            lineDescription: String
        };
    }

    public _firstRendered(): void {
        // get an array of numbers from the string input
        const xValues: number[] = this.xValues.split(",").map(Number);
        const lines: Line[] = [];

        xValues.forEach((xValue, index) => {
            if ((index + 1) % 2 == 0) {
                // max and min X for each line, Get max min Y per this.equation
                lines.push(this.applyEquation(this.equation, xValues[index - 1], xValue));
            }
        });

        // use D3 for SVG
        let svgContainer = d3.select(this.shadowRoot).select("#canvas").append("svg").attr("width", this.graphSize).attr("height", this.graphSize);

        // draw the lines
        lines.forEach((line) => {
            svgContainer.append("line")
            .attr("x1", this.scaleValToGraph(line.startX))
            .attr("y1", this.scaleValToGraph(line.startY))
            .attr("x2", this.scaleValToGraph(line.endX))
            .attr("y2", this.scaleValToGraph(line.endY))
            .attr("stroke-width", 1)
            .attr("stroke", 'red');
            this.lineDescription += line.toString() + ' ';
        });
    }

    private scaleValToGraph(val: number) : number {
        return (this.graphSize / 100) * val;
    }

    // This is a mock
    private applyEquation(equation: string, xMin: number, xMax: number): Line {
        console.log("equation: ", equation);
        let line = new Line(xMin, xMax, this.yMin, this.yMax);
        this.yMin += this.graphSize;
        this.yMax += this.graphSize;
        return line;
    }

    protected _render({ lineDescription }: PlotGraph): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">

        <div class="container">
            <div id='canvas'></div>
            <div class='line-description'> ${lineDescription ? lineDescription : ''} </div>
        </div>
        `;
    }
}

customElements.define("plot-graph", PlotGraph);
