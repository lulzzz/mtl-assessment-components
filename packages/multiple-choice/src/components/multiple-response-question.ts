import { html, TemplateResult, repeat, unsafeHTML, MultipleChoice } from '@hmh/component-base/dist/index';

/**
 * `<multiple-response-question>`
 * In typical use, use `<multiple-response-question>`
 * @demo ./demo/index-mrq.html
 *
 */
export class MultipleResponseQuestion extends MultipleChoice {

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

customElements.define('multiple-response-question', MultipleResponseQuestion);
