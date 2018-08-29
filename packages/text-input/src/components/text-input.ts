import { applyMixins, ComponentBase, Feedback, html, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/response-validation/dist/components/response-validation';

/**
 * `<text-input>`
 * @demo ./demo/index.html
 */
export class TextInput extends ComponentBase<string> implements Feedback {
    public feedbackText: string = '';
    public placeholder: string = '';
    public value: string = '';

    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: string) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];

    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            feedbackText: String,
            placeholder: String,
            value: String
        };
    }

    public getFeedback(): FeedbackMessage{
        return this._getFeedback(this.getValue());
    }


    protected _render({ disabled, feedbackText, placeholder, value }: TextInput): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/text-input.css">
        <div class$="mdc-text-field mdc-text-field--outlined ${disabled ? 'mdc-text-field--disabled' : ''}">
            <input
                disabled=${disabled}
                type="text" 
                id="tf-outlined" 
                class="mdc-text-field__input" 
                value="${value}" 
                placeholder="${placeholder}" 
                on-change="${(evt: Event) => this._onInputChange(evt)}" />
            <div class="mdc-notched-outline">
                <svg>
                <path class="mdc-notched-outline__path"/>
                </svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>
        </div>
        <span>${feedbackText}</span>
        <slot name="feedback" on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}"></slot>
        `;
    }

    protected _didRender(): void {
        MDCTextField.attachTo(this.shadowRoot.querySelector('.mdc-text-field'));
        this._enableAccessibility();
    }

    private _onInputChange(evt: Event): void {
        evt.stopPropagation();
        this.value = (evt.target as HTMLInputElement).value;

        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this.value
                }
            })
        );
    }

    private _enableAccessibility(): void {
        this.setAttribute('role', 'textbox');
        this.setAttribute('aria-placeholder', this.placeholder);
        this.setAttribute('aria-label', this.value || this.placeholder);
    }

    private _onSlotChanged(event: Event) {
        console.log('slot changed');
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                const responseValidationElements: ResponseValidation[] = [];
                for (const el of nodes as ResponseValidation[]) {
                    responseValidationElements.push(el);
                }
                this._responseValidationElements = responseValidationElements;
            }
        }
    }
}

applyMixins(TextInput, [Feedback]);

customElements.define('text-input', TextInput);
