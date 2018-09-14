import { ComponentBase, html, TemplateResult, Feedback, applyMixins, repeat, unsafeHTML, MultipleChoiceMixin } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<multiple-response-question>`
 * In typical use, use `<multiple-response-question>`
 * @demo ./demo/index-mrq.html
 *
 */
export class MultipleResponseQuestion extends ComponentBase<Set<string>> implements Feedback, MultipleChoiceMixin {
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            /* The multiple choice answer options */
            items: Array,
            feedbackMessage: Object
        };
    }

    public feedbackText: string = '';
    public value: Set<string> = new Set();

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
        const feedback = this._getFeedback(this.getValue());
        return feedback;
    }

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
                    <div class="mdc-checkbox" on-click="${(evt: MouseEvent) => this._onItemClicked(evt, item.id)}">
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

    /**
     * Fired when item is clicked
     * @param {Event} event
     * @param {string} id
     */
    _onItemClicked(event: Event, id: string): void {
        event.stopPropagation();
        (event.target as HTMLInputElement).checked ? this.value.add(id) : this.value.delete(id);
    }
}

applyMixins(MultipleResponseQuestion, [Feedback, MultipleChoiceMixin]);
customElements.define('multiple-response-question', MultipleResponseQuestion);
