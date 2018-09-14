import { ComponentBase, html, TemplateResult, Feedback, applyMixins, repeat, unsafeHTML, MultipleChoiceMixin } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<multiple-choice-question>`
 * In typical use, use `<multiple-choice-question>`
 * @demo ./demo/index-mcq.html
 *
 */
export class MultipleChoiceQuestion extends ComponentBase<string> implements Feedback, MultipleChoiceMixin {
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            /* The multiple choice answer options */
            items: Array,
            feedbackMessage: Object
        };
    }

    public value: string = '';

    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: Set<string>) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];
    public _onFeedbackSlotChanged: any;
    public match: (el: ResponseValidation, response: Set<string>) => boolean;
    public feedbackMessage: FeedbackMessage;
    _onSlotChanged: (event: Event) => void;
    showFeedback: () => void;
    items: HTMLElement[] = [];

    public getFeedback(): FeedbackMessage {
        const feedback = this._getFeedback(new Set().add(this.getValue()));
        return feedback;
    }
    public getValue(): string {
        return this.value;
    }

    protected _render({ items, feedbackMessage }: MultipleChoiceQuestion): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/radio/dist/mdc.radio.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/form-field/dist/mdc.form-field.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/multiple-choice.css">
    <div class$="${feedbackMessage ? feedbackMessage.type : ''}">
       ${repeat(
           items,
           (item: HTMLElement) => item.id,
           (item: HTMLElement) => html`
            <div hidden class="mdc-form-field">
                <div class="mdc-radio" tabindex="0" on-click="${(evt: Event) => this._onItemClicked(evt, item.id)}">
                    <input type="radio" class="mdc-radio__native-control"  aria-checked="false"  id$="${item.id}" name="options"/>
                        <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                </div>
                </div>
                <label for$="${item.id}"> ${unsafeHTML(item.innerHTML)} </label>
            </div>`
       )}
        <slot name="options" on-slotchange="${(e: Event) => this._onSlotChanged(e)}" ></slot>
        <slot name="feedback" on-slotchange="${(e: Event) => this._onFeedbackSlotChanged(e)}"></slot>
    </div>
        `;
    }

    /**
     * Fired when item is clicked
     * @param {Event} event
     * @param {string} id
     */
    _onItemClicked(event: Event, id: string): void {
        event.stopPropagation();
        this.value = id;
    }
}

applyMixins(MultipleChoiceQuestion, [Feedback, MultipleChoiceMixin]);
customElements.define('multiple-choice-question', MultipleChoiceQuestion);
