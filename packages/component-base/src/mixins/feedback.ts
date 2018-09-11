import {
    FeedbackMessage,
    ResponseValidation
} from '../components/response-validation';
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
        console.log('MATCH', el, el.getExpected);

        if (!el.getExpected()) {
            // catch-all clause
            return true;
        }

        let equals: boolean = false;

        switch (el.strategy) {
            case Strategy.EXACT_MATCH:
                equals = response.size === el.getExpected().size;
                response.forEach((r: any) => {
                    equals = equals && el.getExpected().has(r);
                });
                return equals;
            case Strategy.FUZZY_MATCH:
                equals = true;
                response.forEach((r: any) => {
                    equals = equals || el.getExpected().has(r);
                });
                return equals;
            default:
                return false;
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