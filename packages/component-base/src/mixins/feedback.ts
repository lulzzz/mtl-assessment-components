import { FeedbackMessage, ResponseValidation } from '@hmh/response-validation/dist/components/response-validation';

/**
 * All components that have feedback must implement this mixin
 */
export abstract class Feedback {
    public abstract _responseValidationElements: ResponseValidation[];

    public _getFeedback(value: any): FeedbackMessage {
        for (const el of this._responseValidationElements) {
            if (el.match(value)) {
                return el.getFeedbackMessage();
            }
        }

        throw new Error('missing default response-validation');
    }

    private _onFeedbackSlotChanged(evt: Event): void {
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
