import { FeedbackMessage, html, TemplateResult, property, repeat, unsafeHTML, MultipleChoice } from '@hmh/component-base';

/**
 * `<multiple-response-question>`
 * In typical use, use `<multiple-response-question>`
 * @demo ./demo/index-mrq.html
 *
 */
export class MultipleResponseQuestion extends MultipleChoice {
    @property({ type: String })
    public feedbackMessage: FeedbackMessage;
    @property({ type: Array })
    public items: HTMLElement[] = [];

    protected render(): TemplateResult {
        const { items, feedbackMessage }: MultipleResponseQuestion = this;
        return html`
        <link rel="stylesheet" href="@material/form-field/dist/mdc.form-field.css">
        <link rel="stylesheet" href="@material/checkbox/dist/mdc.checkbox.css">
        <link rel="stylesheet" href="/css/multiple-choice.css">
        <main class=${feedbackMessage ? feedbackMessage.type : ''}>
            ${repeat(
                items,
                (item: HTMLElement) => item.id,
                (item: HTMLElement) => html`
                    <div hidden class="mdc-form-field" >
                        <div class="mdc-checkbox" @click=${(evt: MouseEvent) => this._onItemClicked(evt, item.id, true)}>
                            <input id=${item.id} type="checkbox" type="checkbox"  class="mdc-checkbox__native-control" />
                                <div class="mdc-checkbox__background">
                                    <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                                        <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                        </div>
                        <label for=${item.id}> ${unsafeHTML(item.innerHTML)} </label>
                    </div>`
            )}
            <slot name="options" @slotchange=${(e: Event) => this._onSlotChanged(e)}></slot>
            <slot name="feedback" @slotchange=${(e: Event) => this._onFeedbackSlotChanged(e)}></slot>
        </main>
            `;
    }
}

customElements.define('multiple-response-question', MultipleResponseQuestion);
