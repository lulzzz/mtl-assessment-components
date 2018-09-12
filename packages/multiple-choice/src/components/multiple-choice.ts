import { ComponentBase, html, TemplateResult, Feedback, applyMixins, repeat, unsafeHTML, MultipleChoiceMixin } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<multiple-choice>`
 * In typical use, use `<multiple-choice> if single correct answer, and <multiple-choice mode="multiple"> if multiple correct answer`
 * @param mode
 * @demo ./demo/index.html
 *
 */
export class MultipleChoice extends ComponentBase<Set<string>> implements Feedback, MultipleChoiceMixin {
    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            /* The multiple choice answer options */
            items: Array,
            /** The mode of muliple choice: ie single or multiple **/
            multiple: Boolean,
            feedbackType: String
        };
    }

    public multiple: boolean;
    public feedbackText: string = '';
    public value: Set<string> = new Set();

    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: Set<string>) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];
    public _onFeedbackSlotChanged: any;
    public match: (el: ResponseValidation, response: Set<string>) => boolean;
    public feedbackMessage: FeedbackMessage;
    private feedbackType: string;
    _onSlotChanged:(event: Event) => void;
    items: HTMLElement[] = [];

    protected _didRender(): void {
        this._enableAccessibility();
        this.setAttribute('value', [...this.value].toString());
    }


    public getFeedback(): FeedbackMessage {
        const feedback = this._getFeedback(this.getValue());
        return feedback;
    }

    public showFeedback(): void {
        this.feedbackType = this.getFeedback().type;
    }

    protected _render({ items, multiple, feedbackType }: MultipleChoice): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/radio/dist/mdc.radio.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/form-field/dist/mdc.form-field.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/checkbox/dist/mdc.checkbox.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/multiple-choice.css">
    <div class$="${feedbackType}">
       ${repeat(
           items,
           (item: HTMLElement) => item.id,
           (item: HTMLElement) => html`
            <div hidden class="mdc-form-field" >
                ${multiple ? this._renderCheckbox(item) : this._renderRadioButton(item)}
                <label for$="${item.id}"> ${unsafeHTML(item.innerHTML)} </label>
            </div>`
       )}
        <slot name="options" on-slotchange="${(e: Event) => this._onSlotChanged(e)}" ></slot>
        <slot name="feedback" on-slotchange="${(e: Event) => this._onFeedbackSlotChanged(e)}"></slot>

    </div>
        `;
    }
    /**
     * Renders a checkbox
     *
     * @return {TemplateResult} checkbox template
     */
    private _renderCheckbox(item: HTMLElement): TemplateResult {
        return html`
        <div class="mdc-checkbox" role="checkbox" on-click="${(evt: MouseEvent) => this._onItemClicked(evt, item.id, 'check')}">
        <input type="checkbox" class="mdc-checkbox__native-control" id$="${item.id}"/>
        <div class="mdc-checkbox__background">
            <svg class="mdc-checkbox__checkmark"
               viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
            </svg>
            <div class="mdc-checkbox__mixedmark"></div>
        </div>
      </div>`;
    }

    /**
     * Renders a radio button
     *
     * @return {TemplateResult} radio button template
     */
    private _renderRadioButton(item: HTMLElement): TemplateResult {
        return html`
        <div class="mdc-radio" role="radio" on-click="${(evt: Event) => this._onItemClicked(evt, item.id, 'radio')}">
         <input class="mdc-radio__native-control" type="radio" id$="${item.id}" name="options">
         <div class="mdc-radio__background">
         <div class="mdc-radio__outer-circle"></div>
         <div class="mdc-radio__inner-circle"></div>
         </div>
     </div>`;
    }

    /**
     * Fired when item is clicked
     * @param {Event} event
     * @param {string} id
     */
    _onItemClicked(event: Event, id: string, type?: string): void {
        event.stopPropagation();
        if (type === 'radio') {
            this.value = new Set();
            this.value.add(id);
            (event.target as HTMLInputElement).setAttribute('aria-selected', 'true');
        } else {
            (event.target as HTMLInputElement).setAttribute('aria-checked', `${(event.target as HTMLInputElement).checked}`);

            (event.target as HTMLInputElement).checked ? this.value.add(id) : this.value.delete(id);
        }
    }

    private _enableAccessibility(): void {
        this.setAttribute('aria-haspopup', 'true');
        this.setAttribute('aria-label', this.innerHTML);
    }
    
}

applyMixins(MultipleChoice, [Feedback, MultipleChoiceMixin]);

customElements.define('multiple-choice', MultipleChoice);
