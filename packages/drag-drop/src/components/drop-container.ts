import { ComponentBase, html, TemplateResult, Feedback, FeedbackMessage, ResponseValidation, Strategy, applyMixins } from '@hmh/component-base/dist/index';
/**
 * `<drag-drop>`
 * @demo ./demo/index.html
 */
export class DropContainer extends ComponentBase<string[]> implements Feedback {
    //public value: string[] = [];
    public feedbackMessage: FeedbackMessage;

    // @mixin: Feedback
    computeFeedback: (value: string[]) => FeedbackMessage;
    _onFeedbackSlotChanged: (evt: Event) => void;

    maxItems: number;

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            containers: Array,
            feedbackMessage: Object,
            maxItems: Number,
            value: Array
        };
    }
    public get value(): string[] {
        const arr: string[] = [];
        for (let i = 0; i < this.childrenNb; i++) {
            arr.push(this.shadowRoot.querySelectorAll('.option-item').item(i).id);
        }
        return arr;
    }
    public get childrenNb(): number {
        return this.shadowRoot.querySelectorAll('.option-item').length;
    }

    public match(el: ResponseValidation, response: string[]): boolean {
        if (!el.expected) {
            // catch-all clause
            return true;
        }
        const expected: string[] = el.expected.split('|');

        switch (el.strategy) {
            case Strategy.CONTAINS:
                return expected.some((answer: string) => response.includes(answer));
            case Strategy.EXACT_MATCH:
            default:
                return response.length === expected.length && expected.every((answer: string) => response.includes(answer));
        }
    }

    protected _render({ feedbackMessage }: DropContainer): TemplateResult {
        this.className = feedbackMessage ? this.feedbackMessage.type : '';

        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drag-drop.css">
        <slot name="feedback" on-slotchange="${(e: Event) => this._onFeedbackSlotChanged(e)}"></slot>

        `;
    }
    drag(ev: DragEvent) {
        ev.stopPropagation();
        ev.dataTransfer.setData('text/plain', (ev.target as HTMLElement).id);
        console.log('drag event', ev.target);
    }
}
applyMixins(DropContainer, [Feedback]);

customElements.define('drop-container', DropContainer);
