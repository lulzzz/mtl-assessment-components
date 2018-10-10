import { ResponseValidation } from '../components/response-validation.js';

/**
 * All components that have feedback must implement this mixin
 */
export enum Strategy {
    ANY = 'any',
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
    public abstract match: (el: ResponseValidation, response: any) => boolean;

    public computeFeedback(value: any): FeedbackMessage {
        for (const el of this._responseValidationElements) {
            if (this.match(el, value)) {
                return el.getFeedback();
            }
        }
        throw new Error('missing default response-validation');
    }

    public _onFeedbackSlotChanged(evt: Event): void {
        const slot: HTMLSlotElement = evt.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: ResponseValidation[] = slot.assignedNodes() as any[];
            const responseValidationElements: ResponseValidation[] = [];
            for (const el of nodes as ResponseValidation[]) {
                responseValidationElements.push(el);
            }
            this._responseValidationElements = responseValidationElements;
        }
    }
}
