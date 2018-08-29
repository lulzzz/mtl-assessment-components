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
}
