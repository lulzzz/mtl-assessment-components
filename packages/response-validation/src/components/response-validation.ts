import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';

export enum FeedbackType {
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    NEUTRAL = 'neutral'
}

export enum Strategy {
    EXACT_MATCH = 'exactMatch',
    FUZZY_MATCH = 'fuzzyMatch',
    MATH_EQUIVALENT = 'mathEquivalent'
}

export interface FeedbackMessage {
    type: FeedbackType;
    message: string;
}

export class ResponseValidation extends ComponentBase<string> {
    public matches: string = '';
    public score: number = 0;
    public feedbackType: FeedbackType = FeedbackType.NEGATIVE;
    public strategy: Strategy = Strategy.MATH_EQUIVALENT;

    private feedbackItems: HTMLElement[] = [];
    private attempts: number = 0;

    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            matches: String,
            score: Number,
            strategy: String
        };
    }

    public match(response: string): boolean {
        switch (this.strategy) {
            case Strategy.EXACT_MATCH:
                return response === this.matches;
            case Strategy.FUZZY_MATCH:
                return response.toLowerCase() === this.matches.toLowerCase();
            default:
                return false;
        }
    }

    public getFeedbackMessage(): FeedbackMessage {
        let type: FeedbackType = this.feedbackType;

        if (!this.feedbackType) {
            type = this.score > 0 ? FeedbackType.POSITIVE : FeedbackType.NEGATIVE;
        }

        this.attempts++;
        let message: string = '';
        if (this.attempts > this.feedbackItems.length) {
            message = this.feedbackItems[this.feedbackItems.length - 1].innerHTML;
        }
        message = this.feedbackItems[this.attempts - 1].innerHTML;

        return { type, message };
    }

    public reset(): void {
        this.attempts = 0;
    }

    protected _render(): TemplateResult {
        return html`<slot name="feedback" on-slotchange="${(evt: Event) => this.onSlotChanged(evt)}"></slot>`;
    }

    private onSlotChanged(event: Event) {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                const feedbackItems: HTMLElement[] = [];
                for (const el of nodes as HTMLElement[]) {
                    feedbackItems.push(el);
                }
                this.feedbackItems = feedbackItems;
            }
        }
    }
}

customElements.define('response-validation', ResponseValidation);
