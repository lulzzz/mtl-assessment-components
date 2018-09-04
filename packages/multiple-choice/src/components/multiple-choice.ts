import { ComponentBase, html, TemplateResult, Feedback, applyMixins, repeat, unsafeHTML } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/response-validation/dist/components/response-validation';

/**
 * `<multiple-choice>`
 * In typical use, use `<multiple-choice> if single correct answer, and <multiple-choice mode="multiple"> if multiple correct answer`
 * @param mode
 * @demo ./demo/index.html
 *
 */
export class MultipleChoice extends ComponentBase<string> implements Feedback {
    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            /* The multiple choice answer options */
            items: Array,
            /** The mode of muliple choice: ie single or multiple **/
            multiple: Boolean
        };
    }

    private items: HTMLElement[] = [];
    private multiple: boolean;
    public feedbackText: string;
    public _onFeedbackSlotChanged: any;

    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: string) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];

    protected _render({ items, multiple }: MultipleChoice): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/radio/dist/mdc.radio.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/form-field/dist/mdc.form-field.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/checkbox/dist/mdc.checkbox.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/multiple-choice.css">
    <main>
       ${repeat(
           items,
           (item: HTMLElement) => item.id,
           (item: HTMLElement) => html`
            <div hidden class="mdc-form-field"> ${multiple ? this._renderCheckbox(item) : this._renderRadioButton(item)}
                <label for$="${item.id}"> ${unsafeHTML(item.innerHTML)} </label>
            </div>`
       )}
        <slot name="options" on-slotchange="${(e: Event) => this._slotChanged(e)}" ></slot>
    </main>
        `;
    }
    /**
     * Renders a checkbox
     *
     * @return {TemplateResult} checkbox template
     */
    private _renderCheckbox(item: HTMLElement): TemplateResult {
        return html`
        <div class="mdc-checkbox" on-click="${(evt: MouseEvent) => this._onItemClicked(evt, item.id)}">
        <input type="checkbox" class="mdc-checkbox__native-control" id="${item.id}"/>
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
        <div class="mdc-radio" on-click="${(evt: MouseEvent) => this._onItemClicked(evt, item.id)}">
         <input class="mdc-radio__native-control" type="radio" id="${item.id}" name="options">
         <div class="mdc-radio__background">
         <div class="mdc-radio__outer-circle"></div>
         <div class="mdc-radio__inner-circle"></div>
         </div>
     </div>`;
    }

    /**
     * Fired when item is clicked
     * @param {MouseEvent} event
     * @param {string} id
     */
    private _onItemClicked(event: MouseEvent, id: string): void {
        event.stopPropagation();
        console.log('clicked on id:', id);
    }

    /**
     * Fired on slot change
     * @param {Event} event
     */
    private _slotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                for (const el of nodes as HTMLElement[]) {
                    items.push(el);
                }
            }
        }
        this.items = items;
    }
}

applyMixins(MultipleChoice, [Feedback]);

customElements.define('multiple-choice', MultipleChoice);
