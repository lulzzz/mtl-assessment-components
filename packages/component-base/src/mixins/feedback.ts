import { FeedbackMessage, ResponseValidation } from '@hmh/response-validation/dist/components/response-validation';

/**
 * All components that have feedback must implement this mixin
 */

export enum Strategy {
    EXACT_MATCH = 'exactMatch',
    FUZZY_MATCH = 'fuzzyMatch',
    MATH_EQUIVALENT = 'mathEquivalent'
}

export abstract class Feedback {
    public abstract _responseValidationElements: ResponseValidation[];

    public _getFeedback(value: any): FeedbackMessage {
        for (const el of this._responseValidationElements) {
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
            case Strategy.EXACT_MATCH:
                return response === el.expected;
            case Strategy.FUZZY_MATCH:
                return response.toLowerCase() === el.expected.toLowerCase();
            default:
                return false;
        }
    }
}
