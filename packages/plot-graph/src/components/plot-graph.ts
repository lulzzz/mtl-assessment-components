import { ComponentBase, html, TemplateResult } from "@hmh/component-base/dist/index";
import { MDCTextField } from "@material/textfield/index";
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
}

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<string> {
  private placeholderText: string = "Solve for Y:";
  private textFieldDisabled: boolean = false;
  private xValues: string;
  private equation: string;

  private yMin: number = 0;
  private yMax: number = 50;

  static get properties(): { [key: string]: string | object } {
    return {
        ...super.properties,
        disableInput: Boolean,
        placeholderText: String,
        textFieldDisabled: Boolean,
        xValues: String,
        equation: String,
    };
  }

  protected _render({ textFieldDisabled, placeholderText }: PlotGraph): TemplateResult {
    return html`
    <link rel="stylesheet" type="text/css" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
    <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">
    <div class="container">
        <div id='canvas'></div>
        <div class$="mdc-text-field mdc-text-field--outlined ${ textFieldDisabled ? "mdc-text-field--disabled" : "" }">
            <input
                disabled="${textFieldDisabled}"ß
                type="text"
                id="tf-outlined"
                class="mdc-text-field__input"
                value=""
                placeholder="${placeholderText}"
                on-change="${(evt: Event) =>
                this._onTextInputChange(evt)}"/>
            <div class="mdc-notched-outline">
                <svg> <path class="mdc-notched-outline__path"/></svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>
        </div>
    </div>
    `;
  }

  public _firstRendered(): void {
    const elem = this.shadowRoot.querySelector(".mdc-text-field");
    MDCTextField.attachTo(elem);
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
    let svgContainer = d3.select(this.shadowRoot).select("#canvas").append("svg").attr("width", 100).attr("height", 100);

    // draw the lines
    lines.forEach((line) => {
        svgContainer.append("line")
        .attr("x1", line.startX)
        .attr("y1", line.startY)
        .attr("x2", line.endX)
        .attr("y2", line.endY)
        .attr("stroke-width", 1)
        .attr("stroke", 'red');
    });
  }

  // TODO : this is meant to be the answer
  private _onTextInputChange(evt: Event): void {
    evt.stopPropagation();
    // const text = (evt.target as HTMLInputElement).value;
  }

  // This is a mock
  private applyEquation(equation: string, xMin: number, xMax: number): Line {
    console.log("equation: ", equation);
    let line = new Line(xMin, xMax, this.yMin, this.yMax);
    this.yMin += 50;
    this.yMax += 50;
    return line;
  }
}

customElements.define("plot-graph", PlotGraph);
