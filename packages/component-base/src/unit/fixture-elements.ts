import { ComponentBase, html, TemplateResult } from '../components/base';
import { MultipleChoice } from '../components/multiple-choice';
import { Feedback, FeedbackMessage } from '../mixins/feedback';
import { ResponseValidation } from '../components/response-validation';
import { applyMixins } from '../index';

export class BaseElement extends ComponentBase<string> {
    public _render(): TemplateResult {
        return html`<main>Hello BaseElement</main>`;
    }
}

export class BaseElementFeedbackWithoutSlot extends ComponentBase<string> implements Feedback {
    // @mixin: feedback
    public computeFeedback: (value: string) => FeedbackMessage;
    public _onFeedbackSlotChanged: any;
    public match: (el: ResponseValidation, response: string[]) => boolean;
    public _render(): TemplateResult {
        return html`<main>Hello BaseElementFeedbackWithoutSlot</main>`;
    }
}

applyMixins(BaseElementFeedbackWithoutSlot, [Feedback]);

export class BaseElementFeedback extends ComponentBase<string> implements Feedback {
    // @mixin: feedback
    public computeFeedback: (value: string) => FeedbackMessage;
    public _onFeedbackSlotChanged: any;
    public match: (el: ResponseValidation, response: string[]) => boolean;
    public _render(): TemplateResult {
        return html`
            <main>Hello BaseElementFeedback</main>
            <slot hidden name="feedback" on-slotchange="${(evt: Event) => this._onFeedbackSlotChanged(evt)}"></slot>`;
    }
}

applyMixins(BaseElementFeedback, [Feedback]);

export class MultipleChoiceElement extends MultipleChoice implements Feedback {
    // @mixin: feedback
    public computeFeedback: (value: string[]) => FeedbackMessage;
    public _onFeedbackSlotChanged: any;
    public _render(): TemplateResult {
        return html`
            <main>Hello MultipleChoiceElement</main>
            <slot name="options" on-slotchange="${(e: Event) => this._onSlotChanged(e)}" ></slot>
            <slot name="feedback" on-slotchange="${(e: Event) => this._onFeedbackSlotChanged(e)}"></slot>`;
    }
}

export class MultipleChoiceWithouSlot extends MultipleChoice implements Feedback {
    // @mixin: feedback
    public computeFeedback: (value: string[]) => FeedbackMessage;
    public _onFeedbackSlotChanged: any;
    public _render(): TemplateResult {
        return html`<main>Hello MultipleChoiceElement</main>`;
    }
}

applyMixins(MultipleChoiceElement, [Feedback]);

customElements.define('base-element', BaseElement);
customElements.define('base-element-feedback', BaseElementFeedback);
customElements.define('base-element-feedback-no-slot', BaseElementFeedbackWithoutSlot);
customElements.define('multiple-choice-element', MultipleChoiceElement);
customElements.define('multiple-choice-element-no-slot', MultipleChoiceWithouSlot);
