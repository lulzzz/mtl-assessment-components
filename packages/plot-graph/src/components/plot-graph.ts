import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index'; 

class Line {
    private _startX: number;
    private _endX: number;
    private _startY: number;
    private _endY: number;

    get startX() : number { return this._startX; }
    get endX() : number { return this._endX; }
    get startY() : number { return this._startY; }
    get endY() : number { return this._endY; }

    constructor(x1: number, x2: number, y1: number, y2: number) {
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
    public value: string;
    // public disableInput: boolean = false;
    private placeholderText: string = 'Solve for Y:';
    private textFieldDisabled: boolean = false;
    private points: string;
    private equation: string;

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            disableInput: Boolean,
            placeholderText: String,
            textFieldDisabled: Boolean,
            points: String,
            equation: String
        };
    }
    
    // TODO : this is meant to be the answer
    private _onTextInputChange(evt: Event): void {
        evt.stopPropagation();
        // const text = (evt.target as HTMLInputElement).value;
        // this.plotGraph();
    }

    protected _render({ textFieldDisabled, placeholderText }: PlotGraph): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">
        <div class="container">
            <canvas id="canvas" width="100" height="100"></canvas>
            <div class$="mdc-text-field mdc-text-field--outlined ${textFieldDisabled ? 'mdc-text-field--disabled' : ''}">
                <input
                    disabled="${textFieldDisabled}"
                    type="text" 
                    id="tf-outlined" 
                    class="mdc-text-field__input" 
                    value="" 
                    placeholder="${placeholderText}" 
                    on-change="${(evt: Event) => this._onTextInputChange(evt)}" />
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
        this.plotGraph();
    }

    private plotGraph(): void {
        const points = this.points.split(",").map(Number);
        const line = this.getGraph(this.equation, points[0], points[1], points[2], points[3]);
        this.drawGraph(line);        
    }

    // TODO: impl me
    private getGraph(equation: string, xMin: number, xMax: number, yMin: number, yMax: number): Line[] {
        console.log('equation: ', equation);
        return [new Line(xMin,xMax,yMin,yMax)];
    }

    private drawGraph(lines: Line[]) {
        const canvas: HTMLCanvasElement = this.shadowRoot.querySelector('#canvas');
        const ctx = canvas.getContext("2d");
        
        lines.forEach((line) => {
            ctx.moveTo(line.startX, line.startX);
            ctx.lineTo(line.endX, line.endY);
            ctx.stroke();
        });

        if (JSON.stringify(this.value) != JSON.stringify(lines)) {
            this.value = JSON.stringify(lines);
            
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
}

customElements.define('plot-graph', PlotGraph);
