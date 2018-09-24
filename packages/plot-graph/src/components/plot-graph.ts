import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index';
import * as d3 from 'd3';

class Line {
    private static _nullValue: number = -10000;
    private _startX: number = Line._nullValue;
    private _endX: number = Line._nullValue;
    private _startY: number = Line._nullValue;
    private _endY: number = Line._nullValue;

    get startX() : number { return this._startX; }
    get endX() : number { return this._endX; }
    get startY() : number { return this._startY; }
    get endY() : number { return this._endY; }

    constructor(x1?: number, x2?: number, y1?: number, y2?: number) {
        this._startX = x1;
        this._endX = x2;
        this._startY = y1;
        this._endY = y2;
    }
}

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<string>{
    private placeholderText: string = 'Solve for Y:';
    private textFieldDisabled: boolean = false;
    private points: string;
    private equation: string;

    private yMin: number = 0;
    private yMax: number = 50;

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            disableInput: Boolean,
            placeholderText: String,
            textFieldDisabled: Boolean,
            points: String,
            equation: String,
        };
    }

    public ready() {
        super.ready();
        this.plotGraph();
    }

    protected _render({ textFieldDisabled, placeholderText, points }: PlotGraph): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">
        <div class="container">
            <div id='canvas' width="100" height="100"> </div>
            <div class$="mdc-text-field mdc-text-field--outlined ${textFieldDisabled ? 'mdc-text-field--disabled' : ''}">
                <input
                    disabled="${textFieldDisabled}"
                    type="text"
                    id="tf-outlined"
                    class="mdc-text-field__input"
                    value=""
                    placeholder="${placeholderText}"
                    on-change="${(evt: Event) => this._onTextInputChange(evt)}"/>
                <div class="mdc-notched-outline">
                    <svg>
                    <path class="mdc-notched-outline__path"/>
                    </svg>
                </div>
                <div class="mdc-notched-outline__idle"></div>
            </div>
        </div>
        `;
    }

    protected _didRender(): void {
        const elem = this.shadowRoot.querySelector('.mdc-text-field');          
        MDCTextField.attachTo(elem);
    }   

    // TODO : this is meant to be the answer
    private _onTextInputChange(evt: Event): void {
        evt.stopPropagation();
        // const text = (evt.target as HTMLInputElement).value;
    }
    
    private plotGraph(): void {
        var lines: Line[] = [];
        const points: number[] = this.points.split(",").map(Number);

        points.forEach((point, index) => {
            if ((index+1) % 2 == 0) {
                // max and min X for each line, Get max min Y per this.equation
                lines.push(this.applyEquation(this.equation, points[index-1], point));
            }
        });

        let svgContainer = d3.select(this.shadowRoot).select("#canvas").append("svg");
        lines.forEach((line) => {
            svgContainer.append("line")
                .attr("x1", line.startX)
                .attr("y1", line.startY)
                .attr("x2", line.endX)
                .attr("y2", line.endY)
                .attr("stroke-width", 1)
                .attr("stroke", "red");

        });

        this.setValue(lines);
    }

    // This is a mock
    private applyEquation(equation: string, xMin: number, xMax: number): Line {
        console.log('equation: ', equation);
        let line = new Line(xMin,xMax,this.yMin,this.yMax);
        this.yMin += 50;
        this.yMax += 50;
        return line;
    }
 
    private setValue(val: Line[]): void {
        this.value = JSON.stringify(val);

        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this.value
                }
            })
        );
    }
}

customElements.define('plot-graph', PlotGraph);