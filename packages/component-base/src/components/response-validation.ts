import { ComponentBase, html, property, TemplateResult } from './base.js';
import { Strategy, FeedbackMessage, FeedbackType } from '../mixins/feedback.js';

export class ResponseValidation extends ComponentBase<string> {
    @property({ reflect: true, type: String })
    public expected: string = '';
    @property({ attribute: 'feedback-type', reflect: true, type: String })
    public feedbackType: FeedbackType;
    @property({ reflect: true, type: Number })
    public score: number = 0;
    @property({ reflect: true, type: String })
    public strategy: Strategy = Strategy.EXACT_MATCH;

    private feedbackItems: HTMLElement[] = [];
    private attempts: number = 0;

    public getFeedback(): FeedbackMessage {
        let type: FeedbackType = this.feedbackType;
        const score = this.score;
        if (!this.feedbackType) {
            type = this.score > 0 ? FeedbackType.POSITIVE : FeedbackType.NEGATIVE;
        }

        this.attempts++;
        let message: string = '';
        if (this.feedbackItems.length > 0) {
            if (this.attempts >= this.feedbackItems.length) {
                message = this.feedbackItems[this.feedbackItems.length - 1].innerHTML;
            } else {
                message = this.feedbackItems[this.attempts - 1].innerHTML;
            }
        }

        return { type, message, score };
    }

    public reset(): void {
        this.attempts = 0;
    }

    protected render(): TemplateResult {
        return html`<slot @slotchange=${(evt: Event) => this._onSlotChanged(evt)}></slot>`;
    }

    private _onSlotChanged(event: Event) {
        event.stopPropagation();
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        const nodes: Node[] = slot.assignedNodes();
        const feedbackItems: HTMLElement[] = [];
        for (const el of nodes as HTMLElement[]) {
            if (el && el.tagName) {
                feedbackItems.push(el);
            }
        }
        this.feedbackItems = feedbackItems;
    }
}

customElements.define('response-validation', ResponseValidation);
