import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index'; 

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
            x1: String,
            y1: String,
            x2: String,
            y2: String,
            disableInput: Boolean,
            placeholderText: String,
            textFieldDisabled: Boolean
        };
    }
    
    private _onTextInputChange(evt: Event): void {
        evt.stopPropagation();
        const text = (evt.target as HTMLInputElement).value;
        this.parseEquation(text);
    }

    // TODO: impl me
    private parseEquation(equation: string): void {
        this.plotGraph(0,0,50,50);
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
        this.plotGraph(parseInt(this.x1),parseInt(this.y1),parseInt(this.x2), parseInt(this.y2));
    }

    private plotGraph(x1: number, y1: number, x2: number, y2: number ) {
        const canvas: HTMLCanvasElement = this.shadowRoot.querySelector('#canvas');
        const ctx = canvas.getContext("2d");

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        if (JSON.stringify(this.value) != JSON.stringify([x1,y1,x2,y2])) {
            this.value = JSON.stringify([x1,y1,x2,y2]);
            
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
