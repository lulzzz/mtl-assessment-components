import { FeedbackMessage, html, property, TemplateResult, repeat, unsafeHTML, MultipleChoice } from '@hmh/component-base';

/**
 * `<multiple-choice-question>`
 * In typical use, use `<multiple-choice-question>`
 * @demo ./demo/index-mcq.html
 *
 */
export class MultipleChoiceQuestion extends MultipleChoice {
    @property({ type: String })
    public feedbackMessage: FeedbackMessage;
    @property({ type: Array })
    public items: HTMLElement[] = [];

    protected render(): TemplateResult {
        const { items, feedbackMessage }: MultipleChoiceQuestion = this;
        return html`
        <link rel="stylesheet" href="@material/radio/dist/mdc.radio.css">
        <link rel="stylesheet" href="@material/form-field/dist/mdc.form-field.css">
        <link rel="stylesheet" href="/css/multiple-choice.css">
        <main class=${feedbackMessage ? feedbackMessage.type : ''}>
        ${repeat(
            items,
            (item: HTMLElement) => item.id,
            (item: HTMLElement) => html`
                <div hidden class="mdc-form-field">
                    <div class="mdc-radio" @click=${(evt: Event) => this._onItemClicked(evt, item.id, false)}>
                        <input type="radio" class="mdc-radio__native-control"  id=${item.id} name="options" />
                        <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
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

customElements.define('multiple-choice-question', MultipleChoiceQuestion);
