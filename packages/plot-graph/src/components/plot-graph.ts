import { ComponentBase, html, TemplateResult, Feedback, FeedbackMessage, Strategy, applyMixins } from "@hmh/component-base/dist/index";
import { MDCTextField } from "@material/textfield/index";
import { ResponseValidation } from '@hmh/component-base/dist/index';
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
export class PlotGraph extends ComponentBase<string> implements Feedback {
    private placeholderText: string = "Solve for Y:";
    private textFieldDisabled: boolean = false;
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

    // @mixin: feedback
    public computeFeedback: (value: string) => FeedbackMessage;
    public _onFeedbackSlotChanged: any;

    public match(el: ResponseValidation, response: string): boolean {
        if (!el.expected) {
            // catch-all clause
            return true;
        }

        switch (el.strategy) {
            case Strategy.FUZZY_MATCH:
                return el.expected.toLowerCase() === (response ? response.toLowerCase() : '');
            case Strategy.EXACT_MATCH:
            default:
                return el.expected === (response ? response.toLowerCase() : '');
        }
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

    protected _render({ textFieldDisabled, placeholderText, lineDescription, feedbackMessage }: PlotGraph): TemplateResult {
        console.log('feedbackMessage: ', feedbackMessage);

        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">

        <div class$="container ${this._getFeedbackClass(feedbackMessage, true)}">
            <div id='canvas'></div>
            <div class='line-description'> ${lineDescription ? lineDescription : ''} </div>

            <div class="bottom-ui-container">
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
                <span class$="feedback-message ${this._getFeedbackClass(feedbackMessage, false)}">${feedbackMessage ? feedbackMessage.message : ''}</span>          
            </div>
        </div>

        <slot hidden name="feedback" on-slotchange="${(evt: Event) => this._onFeedbackSlotChanged(evt)}"></slot>
        `;
    }

    /**
     * Get feedback classes for UI depending upon feedbackMessage.type
     *
     * @param  {FeedbackMessage} feedbackMessage
     * @returns String
     */
    private _getFeedbackClass(feedbackMessage: FeedbackMessage, isContainer: boolean): string {
        if (!feedbackMessage) {
            return '';
        }

        return isContainer ? `feedback-${feedbackMessage.type}-border` : `feedback-${feedbackMessage.type}-background`;
    }
  
    private _onTextInputChange(evt: Event): void {
        evt.stopPropagation();
        this.value = (evt.target as HTMLInputElement).value;
    }
}

applyMixins(PlotGraph, [Feedback]);

customElements.define("plot-graph", PlotGraph);
