import { ComponentBase, html, TemplateResult } from './base';
import { Strategy, FeedbackMessage, FeedbackType } from '../mixins/feedback';

export class ResponseValidation extends ComponentBase<string> {
    public expected: string = '';
    public feedbackType: FeedbackType;
    public score: number = 0;
    public strategy: Strategy = Strategy.EXACT_MATCH;

    private feedbackItems: HTMLElement[] = [];
    private attempts: number = 0;

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            expected: String,
            feedbackType: String,
            score: Number,
            strategy: String
        };
    }
     
    /*
    getExpected(): Set<string> {
        return this.expected !== '' ? new Set(this.expected.split('|')) : null; //TODO: fix
    }*/

    public getFeedbackMessage(): FeedbackMessage {
        let type: FeedbackType = this.feedbackType;
        const score = this.score;
        if (!this.feedbackType) {
            type = this.score > 0 ? FeedbackType.POSITIVE : FeedbackType.NEGATIVE;
        }

        this.attempts++;
        let message: string = '';
        if (this.attempts >= this.feedbackItems.length) {
            message = this.feedbackItems[this.feedbackItems.length - 1].innerHTML;
        } else {
            message = this.feedbackItems[this.attempts - 1].innerHTML;
        }

        return { type, message, score };
    }

    public reset(): void {
        this.attempts = 0;
    }

    protected _render(): TemplateResult {
        return html`
            <slot on-slotchange="${(evt: Event) => this.onSlotChanged(evt)}"></slot>
        `;
    }

    private onSlotChanged(event: Event) {
        event.stopPropagation();
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                const feedbackItems: HTMLElement[] = [];
                for (const el of nodes as HTMLElement[]) {
                    if (el && el.tagName) {
                        feedbackItems.push(el);
                    }
                }
                this.feedbackItems = feedbackItems;
            }
        }
    }
}

customElements.define('response-validation', ResponseValidation);
