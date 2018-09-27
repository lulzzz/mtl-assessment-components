import { ComponentBase, html, TemplateResult, Feedback, FeedbackMessage, ResponseValidation, Strategy, applyMixins } from '@hmh/component-base/dist/index';
/**
 * `<drop-container>`
 * @demo ./demo/index-drop-container.html
 */
export class DropContainer extends ComponentBase<string[]> implements Feedback {
    maxItems: number;
    public addedItems: HTMLElement[] = [];

    // @mixin: Feedback
    computeFeedback: (value: string[]) => FeedbackMessage;
    _onFeedbackSlotChanged: (evt: Event) => void;

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            addedItems: Array,
            maxItems: Number,
            value: Array
        };
    }
    public get value(): string[] {
        return this.addedItems.map((x: HTMLElement) => x.id);
    }
    public get childrenNb(): number {
        return this.addedItems.length;
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
        <slot name="options" on-slotchange="${(e: Event) => this._onSlotChanged(e)}" ></slot>

        `;
    }
    _onSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach(
                    (el: HTMLElement): void => {
                        items.push(el);
                    }
                );
            }
        }
        this.addedItems = items;
    }
}
applyMixins(DropContainer, [Feedback]);

customElements.define('drop-container', DropContainer);
