import { ResponseValidation } from '../components/response-validation';

/**
 * All components that have feedback must implement this mixin
 */
export enum Strategy {
    CONTAINS = 'contains',
    EXACT_MATCH = 'exactMatch',
    FUZZY_MATCH = 'fuzzyMatch',
    MATH_EQUIVALENT = 'mathEquivalent'
}

export enum FeedbackType {
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    NEUTRAL = 'neutral'
}

export interface FeedbackMessage {
    type: FeedbackType;
    message: string;
    score: number;
}

export abstract class Feedback {
    public abstract feedbackMessage: FeedbackMessage;

    public abstract _responseValidationElements: ResponseValidation[];

    public _getFeedback(value: any): FeedbackMessage {
        for (const el of this._responseValidationElements) {
            console.log('_getFeedback', el, value);
            if (this.match(el, value)) {
                return el.getFeedbackMessage();
            }
        }
        throw new Error('missing default response-validation');
    }

    public match(el: ResponseValidation, response: any): boolean {
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

    public _onFeedbackSlotChanged(evt: Event): void {
        const slot: HTMLSlotElement = evt.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: ResponseValidation[] = slot.assignedNodes() as any[];
            if (nodes) {
                const responseValidationElements: ResponseValidation[] = [];
                for (const el of nodes as ResponseValidation[]) {
                    responseValidationElements.push(el);
                }
                this._responseValidationElements = responseValidationElements;
            }
        }
    }
}
