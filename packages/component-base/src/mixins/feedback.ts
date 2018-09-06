import { FeedbackMessage, ResponseValidation } from '@hmh/response-validation/dist/components/response-validation';

export enum Strategy {
    EXACT_MATCH = 'exactMatch',
    FUZZY_MATCH = 'fuzzyMatch',
    MATH_EQUIVALENT = 'mathEquivalent'
}

/**
 * All components that have feedback must implement this mixin
 */
export abstract class Feedback {
    public abstract _responseValidationElements: ResponseValidation[];

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

    public _getFeedback(value: any): FeedbackMessage {
        for (const el of this._responseValidationElements) {
            if (this.match(el, value)) {
                return el.getFeedbackMessage();
            }
        }

        throw new Error('missing default response-validation');
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
