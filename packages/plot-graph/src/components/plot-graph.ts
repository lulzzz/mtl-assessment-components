import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index'; 

class Line {
    public startX: number;
    public endX: number;
    public startY: number;
    public endY: number;

    constructor(x1: number, x2: number, y1: number, y2: number) {
        this.startX = x1;
        this.endX = x2;
        this.startY = y1;
        this.endY = y2;
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

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            xMax: String,
            xMin: String,
            yMax: String,
            yMin: String,
            disableInput: Boolean,
            placeholderText: String,
            textFieldDisabled: Boolean
        };
    }
    
    private _onTextInputChange(evt: Event): void {
        evt.stopPropagation();
        // const text = (evt.target as HTMLInputElement).value;
        const lines = this.getGraph('some equation', Number(this.xMin), Number(this.xMax), Number(this.yMin), Number(this.yMax));
        this.plotGraph(lines);
    }

    // TODO: impl me
    private getGraph(equation: string, xMin: number, xMax: number, yMin: number, yMax: number): Line[] {
        return [new Line(xMin,xMax,yMin,yMax)];
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
        const lines = this.getGraph('some equation', this.xMin, this.xMax, this.yMin, this.yMax);
        this.plotGraph(lines);
    }

    private plotGraph(lines: Line[]) {
        const canvas: HTMLCanvasElement = this.shadowRoot.querySelector('#canvas');
        const ctx = canvas.getContext("2d");
        console.log('lines:', lines);

        lines.forEach((line) => {
            ctx.moveTo(line.startX, line.startY);
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
