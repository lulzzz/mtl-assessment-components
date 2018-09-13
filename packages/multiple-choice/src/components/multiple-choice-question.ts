import { ComponentBase, html, TemplateResult, Feedback, applyMixins, repeat, unsafeHTML, MultipleChoiceMixin } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<multiple-choice>`
 * In typical use, use `<multiple-choice> if single correct answer, and <multiple-choice mode="multiple"> if multiple correct answer`
 * @demo ./demo/index.html
 *
 */
export class MultipleChoiceQuestion extends ComponentBase<string> implements Feedback, MultipleChoiceMixin {
    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            /* The multiple choice answer options */
            items: Array,
            feedbackType: String
        };
    }

    public feedbackText: string = '';
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
    feedbackType: string = '';

    protected _didRender(): void {
        this._enableAccessibility();
        this.setAttribute('value', this.value);
    }

    public getFeedback(): FeedbackMessage {
        //const feedback = this._getFeedback(this.getValue() !== '' ? new Set(this.getValue()) : new Set());
        const convertedValue: Set<string> = new Set();
        convertedValue.add(this.getValue());
        const feedback = this._getFeedback(convertedValue);
        return feedback;
    }
    public getValue(): string {
        return this.value;
    }

    protected _render({ items, feedbackType }: MultipleChoiceQuestion): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/radio/dist/mdc.radio.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/form-field/dist/mdc.form-field.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/multiple-choice.css">
    <div class$="${feedbackType}" role="radiogroup">
       ${repeat(
           items,
           (item: HTMLElement) => item.id,
           (item: HTMLElement) => html`
            <div hidden class="mdc-form-field" >
                <div class="mdc-radio" role="radio" on-click="${(evt: Event) => this._onItemClicked(evt, item.id)}">
                    <input class="mdc-radio__native-control" type="radio" id$="${item.id}" name="options"/>
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
        (event.target as HTMLInputElement).setAttribute('aria-selected', 'true');
    }

    private _enableAccessibility(): void {
        this.setAttribute('aria-haspopup', 'true');
        this.setAttribute('aria-label', this.innerHTML);
    }
}

applyMixins(MultipleChoiceQuestion, [Feedback, MultipleChoiceMixin]);

customElements.define('multiple-choice-question', MultipleChoiceQuestion);
