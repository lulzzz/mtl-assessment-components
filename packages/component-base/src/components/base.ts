import { LitElement } from '@polymer/lit-element/lit-element';
export { TemplateResult } from 'lit-html/lit-html';
export { html } from '@polymer/lit-element/lit-element';
export { repeat } from 'lit-html/lib/repeat';
export { unsafeHTML } from 'lit-html/lib/unsafe-html';
import { FeedbackMessage } from '../mixins/feedback';
import { ResponseValidation } from './response-validation';

export enum Mode {
    INTERACTIVE = 'interactive',
    READONLY = 'readonly',
    RESOLVED = 'resolved'
}

/**
 * `<component-base>`
 * A drop down menu that supports embedded HTML within its option elements.
 * Currently uses Set for value so option values must be unique.
 * @demo ./demo/index.html
 */
export class ComponentBase<T> extends LitElement {
    /**
     * Properties that all common to all interactions
     */
    static get properties(): { [key: string]: string | object } {
        return {
            disabled: Boolean,
            feedbackMessage: Object,
            mode: String,
            value: String
        };
    }

    public disabled: boolean = false;
    public mode: Mode = Mode.INTERACTIVE;
    public value: T;
    public feedbackMessage: FeedbackMessage;
    public _responseValidationElements: ResponseValidation[] = [];

    /**
     * Call this function to display feedback to the user
     */
    public showFeedback(): void {
        if (typeof this.computeFeedback === 'function') {
            this.feedbackMessage = this.computeFeedback(this.value);
        }
    }

    public getFeedback(): FeedbackMessage {
        return this.feedbackMessage;
    }

    public getValue(): T {
        return this.value;
    }
}
