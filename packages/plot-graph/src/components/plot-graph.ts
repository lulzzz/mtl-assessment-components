import { applyMixins, ComponentBase, Feedback, FeedbackMessage, Strategy, html, TemplateResult } from '@hmh/component-base/dist/index';
import { ResponseValidation } from '@hmh/component-base/dist/index';

/**
 * `<text-input>`
 * @demo ./demo/index.html
 */
export class PlotGraph extends ComponentBase<string> implements Feedback {
    public value: string = '';

    // @mixin: feedback
    public computeFeedback: (value: string) => FeedbackMessage;
    public _onFeedbackSlotChanged: any;

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            value: String
        };
    }

    public match(el: ResponseValidation, response: string): boolean {
        if (!el.expected) {
            // catch-all clause
            return true;
        }

        switch (el.strategy) {
            case Strategy.FUZZY_MATCH:
                return el.expected.toLowerCase() === response.toLowerCase();
            case Strategy.EXACT_MATCH:
            default:
                return el.expected === response;
        }
    }

    protected _render({ feedbackMessage, value }: PlotGraph): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/text-input.css">
        <p> test </p>
        <slot hidden name="feedback" on-slotchange="${(evt: Event) => this._onFeedbackSlotChanged(evt)}"></slot>
        `;
    }

}

applyMixins(PlotGraph, [Feedback]);

customElements.define('plot-graph', PlotGraph);
