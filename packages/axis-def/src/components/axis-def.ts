import { html, TemplateResult, ComponentBase } from '@hmh/component-base';

/**
 * `<axis-def>`
 * @demo ./demo/index.html
 */
export class AxisDef extends ComponentBase<any> {
    // this element exists only to serve as an input structure for plot-graph
    protected render(): TemplateResult {
        return html``;
    }
}

customElements.define('axis-def', AxisDef);
