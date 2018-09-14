import {
    ComponentBase,
    html,
    TemplateResult,
    Feedback,
    FeedbackMessage,
    applyMixins,
    repeat,
    unsafeHTML,
    MultipleChoice
} from '@hmh/component-base/dist/index';
import { ResponseValidation } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<multiple-response-question>`
 * In typical use, use `<multiple-response-question>`
 * @demo ./demo/index-mrq.html
 *
 */
export class MultipleResponseQuestion extends ComponentBase<string[]> implements MultipleChoice, Feedback {
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            /* The multiple choice answer options */
            items: Array,
            feedbackMessage: Object
        };
    }

    public feedbackText: string = '';
    public value: string[] = [];

    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: Set<string>) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];
    public _onFeedbackSlotChanged: any;
    public _onItemClicked: (event: Event, selected: string, multiple?: boolean) => void;
    public match: (el: ResponseValidation, response: string[]) => boolean;
    public feedbackMessage: FeedbackMessage;
    _onSlotChanged: (event: Event) => void;
    showFeedback: () => void;
    items: HTMLElement[] = [];

    protected _render({ items, feedbackMessage }: MultipleResponseQuestion): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/form-field/dist/mdc.form-field.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/checkbox/dist/mdc.checkbox.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/multiple-choice.css">
        <div class$="${feedbackMessage ? this.feedbackMessage.type : ''}">
            ${repeat(
                items,
                (item: HTMLElement) => item.id,
                (item: HTMLElement) => html`
                    <div hidden class="mdc-form-field" >
                        <div class="mdc-checkbox" on-click="${(evt: MouseEvent) => this._onItemClicked(evt, item.id, true)}">
                            <input type="checkbox" type="checkbox"  class="mdc-checkbox__native-control" id$="${item.id}"/>
                                <div class="mdc-checkbox__background">
                                    <svg class="mdc-checkbox__checkmark"viewBox="0 0 24 24">
                                        <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
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

applyMixins(MultipleResponseQuestion, [MultipleChoice, Feedback]);
customElements.define('multiple-response-question', MultipleResponseQuestion);
