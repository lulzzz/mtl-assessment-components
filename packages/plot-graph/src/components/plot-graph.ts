import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';

/**
 * `<plot-graph>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<string>{
    public value: string;

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            x1: String,
            y1: String,
            x2: String,
            y2: String
        };
    }
    
    protected _render({}: PlotGraph): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/plot-graph.css">
        <canvas id="canvas" width="200" height="200"></canvas>
        `;
    }
    
    protected _didRender() {
        this.plotGraph(parseInt(this.x1),parseInt(this.y1),parseInt(this.x2), parseInt(this.y2));
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
