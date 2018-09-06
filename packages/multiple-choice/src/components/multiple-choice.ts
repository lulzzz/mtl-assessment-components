import { ComponentBase, html, TemplateResult, Feedback, applyMixins, repeat, unsafeHTML, Strategy } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<multiple-choice>`
 * In typical use, use `<multiple-choice> if single correct answer, and <multiple-choice mode="multiple"> if multiple correct answer`
 * @param mode
 * @demo ./demo/index.html
 *
 */
export class MultipleChoice extends ComponentBase<Set<string>> implements Feedback {
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

    private items: HTMLElement[] = [];
    private multiple: boolean;
    private feedbackType: string;
    public feedbackText: string = '';
    public value: Set<string> = new Set();


    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: Set<string>) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];
    public _onFeedbackSlotChanged: any;

    public match: (el: ResponseValidation, response: Set<string>) => boolean = (el, response) => {
        if (!el.getExpected()) {
            // catch-all clause
            return true;
        }
        switch (el.strategy) {
            case Strategy.EXACT_MATCH:
                let equals: boolean = response.size === el.getExpected().size;
                response.forEach((r: any) => {
                    equals = equals && el.getExpected().has(r);
                });
                return equals;
            case Strategy.FUZZY_MATCH:
                equals = true;
                response.forEach((r: any) => {
                    equals = equals || el.getExpected().has(r);
                });
                return equals;
            default:
                return false;
        }
    };

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
            <div hidden class="mdc-form-field" > ${multiple ? this._renderCheckbox(item) : this._renderRadioButton(item)}
                <label for$="${item.id}"> ${unsafeHTML(item.innerHTML)} </label>
            </div>`
       )}
        <slot name="options" on-slotchange="${(e: Event) => this._slotChanged(e)}" ></slot>
        <slot name="feedback" on-slotchange="${(e: Event) => this._feedbackSlotChanged(e)}"></slot>

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
        <div class="mdc-checkbox" on-click="${(evt: MouseEvent) => this._onItemClicked(evt, item.id, 'check')}">
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
        <div class="mdc-radio" on-click="${(evt: Event) => this._onItemClicked(evt, item.id, 'radio')}">
         <input class="mdc-radio__native-control" type="radio" id="${item.id}" name="options">
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
    private _onItemClicked(event: Event, id: string, element: string): void {
        event.stopPropagation();
        if (element === 'radio') {
            this.value = new Set();
            this.value.add(id);
        } else {
            (event.target as HTMLInputElement).checked ? this.value.add(id) : this.value.delete(id);
        }
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
    /**
     * Fired on slot change
     * @param {Event} event
     */
    private _feedbackSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: ResponseValidation[] = slot.assignedNodes() as any[];
            if (nodes) {
                const responseValidationElements: ResponseValidation[] = [];
                for (const el of nodes) {
                    responseValidationElements.push(el);
                }
                this._responseValidationElements = responseValidationElements;
            }
        }
    }
}

applyMixins(MultipleChoice, [Feedback]);

customElements.define('multiple-choice', MultipleChoice);
