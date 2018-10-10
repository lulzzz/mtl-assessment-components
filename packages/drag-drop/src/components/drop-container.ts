import { applyMixins, ComponentBase, Feedback, FeedbackMessage, html, property, ResponseValidation, Strategy, TemplateResult } from '@hmh/component-base';
/**
 * `<drop-container>`
 * @demo ./demo/index-drop-container.html
 */
export class DropContainer extends ComponentBase<string[]> implements Feedback {
    @property({ type: Number, attribute: 'max-items' })
    public maxItems: number;
    @property({ type: Array })
    public addedItems: string[] = [];

    // @mixin: Feedback
    computeFeedback: (value: string[]) => FeedbackMessage;
    _onFeedbackSlotChanged: (evt: Event) => void;

    public get value(): string[] {
        return Array.from(this.getElementsByClassName('option-item')).map((x: HTMLElement) => x.id);
    }
    public get childrenCount(): number {
        return this.addedItems.length;
    }
    public getElement(id: string): HTMLElement {
        return Array.from(this.getElementsByClassName('option-item')).find((x: HTMLElement) => x.id === id) as HTMLElement;
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
    public add(element: HTMLElement, x: number, y: number): void {
        element.style.left = x.toString();
        element.style.top = y.toString();
        this.appendChild(element);
    }
    protected render(): TemplateResult {
        this.className = this.feedbackMessage ? this.feedbackMessage.type : '';

        return html`
        <link rel="stylesheet" href="/css/drag-drop.css">
        <slot name="feedback" @slotchange=${(e: Event) => this._onFeedbackSlotChanged(e)}></slot>
        <slot name="options" @slotchange=${(e: Event) => this._onSlotChanged(e)} ></slot>

        `;
    }
    private _onSlotChanged(event: Event): void {
        const items: string[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    if (el.classList.contains('option-item')) {
                        items.push(el.id);
                    }
                }
            );
        }

        this.addedItems = items;
    }
}
applyMixins(DropContainer, [Feedback]);

customElements.define('drop-container', DropContainer);
