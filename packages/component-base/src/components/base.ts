import { LitElement, property } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export { TemplateResult } from 'lit-html';
export { html, property } from '@polymer/lit-element';
export { ifDefined } from 'lit-html/directives/if-defined.js';
export { repeat } from 'lit-html/directives/repeat.js';
export { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { FeedbackMessage } from '../mixins/feedback.js';
import { ResponseValidation } from './response-validation.js';

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
export abstract class ComponentBase<T> extends LitElement {
    @property({ type: Boolean, reflect: true })
    public disabled: boolean = false;
    @property({ type: String })
    public feedbackMessage: FeedbackMessage;
    @property({ type: String })
    public mode: Mode = Mode.INTERACTIVE;
    @property({ type: String })
    public value: T;

    // Feedback related
    public _onFeedbackSlotChanged: any;
    public _responseValidationElements: ResponseValidation[] = [];
    public computeFeedback: any;

    // from @polymer/lit-element
    protected abstract render(): TemplateResult;

    public match(el: ResponseValidation, response: any): boolean {
        if (!el.expected) {
            // catch-all clause
            return true;
        }

        return el.expected === response.toString();
    }

    /**
     * Call this function to display feedback to the user
     */
    public showFeedback(): void {
        if (typeof this.computeFeedback === 'function') {
            this.feedbackMessage = this.computeFeedback(this.value);
        } else {
            throw new Error('unsupported method');
        }
    }

    public getFeedback(): FeedbackMessage {
        if (typeof this.computeFeedback === 'function') {
            return this.computeFeedback(this.value);
        } else {
            return null;
        }
    }

    public getValue(): T {
        return this.value;
    }
}
