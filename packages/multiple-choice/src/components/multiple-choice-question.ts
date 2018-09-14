import { ComponentBase, html, TemplateResult, Feedback, FeedbackMessage, applyMixins, repeat, unsafeHTML, MultipleChoice } from '@hmh/component-base/dist/index';
import { ResponseValidation } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<multiple-choice-question>`
 * In typical use, use `<multiple-choice-question>`
 * @demo ./demo/index-mcq.html
 *
 */
export class MultipleChoiceQuestion extends ComponentBase<string[]> implements MultipleChoice, Feedback {
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            /* The multiple choice answer options */
            items: Array,
            feedbackMessage: Object
        };
    }

    public value: string[] = [];

    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: Set<string>) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];
    public _onFeedbackSlotChanged: any;
    public _onItemClicked: (event: Event, selected: string, multiple?: boolean) => void;
    public match: (el: ResponseValidation, response: string[]) => boolean;
    public feedbackMessage: FeedbackMessage;
    public _onSlotChanged: (event: Event) => void;
    public showFeedback: () => void;
    public items: HTMLElement[] = [];

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
                <div class="mdc-radio" tabindex="0" on-click="${(evt: Event) => this._onItemClicked(evt, item.id, false)}">
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
}

applyMixins(MultipleChoiceQuestion, [MultipleChoice, Feedback]);
customElements.define('multiple-choice-question', MultipleChoiceQuestion);
