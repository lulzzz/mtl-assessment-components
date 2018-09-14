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
        if (typeof this._getFeedback === 'function') {
            this.feedbackMessage = { ...this._getFeedback(this.value) };
        } else {
            throw new Error('Unsupported method');
        }
    }

    public getValue(): T {
        return this.value;
    }
}
