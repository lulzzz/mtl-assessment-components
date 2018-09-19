import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index'; 

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<string>{
    public value: string;
    public disableInput: boolean = false;
    private placeholderText: string = 'Enter Equation Here';


    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            x1: String,
            y1: String,
            x2: String,
            y2: String,
            disableInput: Boolean
        };
    }
    
    private _onTextInputChange(evt: Event): void {
        evt.stopPropagation();
        const text = (evt.target as HTMLInputElement).value;
        console.log('text:', text);
        this.parseEquation(text);
    }

    // TODO: impl me
    private parseEquation(equation: string): void {
        this.plotGraph(0,0,50,50);
    }

    protected _render({disableInput}: PlotGraph): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">
        <canvas id="canvas" width="100" height="100"></canvas>
        <div class$="mdc-text-field mdc-text-field--outlined">
            <input
                disabled$="${disableInput}"
                placeholder="${this.placeholderText}" 
                type="text" 
                id="tf-outlined" 
                class="mdc-text-field__input" 
                value="" 
                on-change="${(evt: Event) => this._onTextInputChange(evt)}" />
            <div class="mdc-notched-outline">
                <svg>
                <path class="mdc-notched-outline__path"/>
                </svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>
        </div>
        `;
    }
    
    protected _didRender() {
        this.plotGraph(parseInt(this.x1),parseInt(this.y1),parseInt(this.x2), parseInt(this.y2));
        MDCTextField.attachTo(this.shadowRoot.querySelector('.mdc-text-field'));
    }

    private plotGraph(x1: number, y1: number, x2: number, y2: number ) {
        const canvas = this.shadowRoot.querySelector('#canvas');
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
