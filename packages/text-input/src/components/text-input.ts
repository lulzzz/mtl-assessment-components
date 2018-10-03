import { applyMixins, ComponentBase, Feedback, FeedbackMessage, Strategy, html, property, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index';
import { ResponseValidation } from '@hmh/component-base/dist/index';

/**
 * `<text-input>`
 * @demo ./demo/index.html
 */
export class TextInput extends ComponentBase<string> implements Feedback {
    @property({ type: Boolean, reflect: true })
    public disabled: boolean = false;
    @property({ type: String })
    public feedbackMessage: FeedbackMessage;
    @property({ type: String, reflect: true })
    public placeholder: string = '';
    @property({ type: String })
    public value: string = '';

    // @mixin: feedback
    public computeFeedback: (value: string) => FeedbackMessage;
    public _onFeedbackSlotChanged: any;

    public match(el: ResponseValidation, response: string): boolean {
        if (!el.expected) {
            // catch-all clause
            return true;
        }

        switch (el.strategy) {
            case Strategy.FUZZY_MATCH:
                return el.expected.toLowerCase() === response.toLowerCase();
            case Strategy.EXACT_MATCH:
            default:
                return el.expected === response;
        }
    }

    protected render(): TemplateResult {
        const { disabled, feedbackMessage, placeholder, value }: TextInput = this;
        const feedbackBanner: TemplateResult =
            feedbackMessage && feedbackMessage.message
                ? html`<div class="feedback-message">
                    <div>${feedbackMessage.message}<div>
                </div>`
                : html``;

        return html`
        <link rel="stylesheet" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
        <link rel="stylesheet" href="/dist/css/text-input.css">
        ${this._feedbackStyle(feedbackMessage)}
        <div class="mdc-text-field mdc-text-field--outlined ${disabled ? 'mdc-text-field--disabled' : ''}">
            <input
                ?disabled="${disabled}"
                type="text"
                id="tf-outlined"
                class="mdc-text-field__input"
                .value=${value}
                placeholder=${placeholder}
                @change=${(evt: Event) => this._onInputChange(evt)} />
            <div class="mdc-notched-outline">
                <svg>
                <path class="mdc-notched-outline__path"/>
                </svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>
            ${feedbackBanner}
        </div>
        <slot hidden name="feedback" @slotchange=${(evt: Event) => this._onFeedbackSlotChanged(evt)}></slot>
        `;
    }

    protected updated(): void {
        MDCTextField.attachTo(this.shadowRoot.querySelector('.mdc-text-field'));
        this._enableAccessibility();
    }

    private _feedbackStyle(feedbackMessage: FeedbackMessage): TemplateResult {
        const feedbackColorMap = {
            submitted: 'var(--submitted-color, gray)',
            positive: 'var(--positive-color, green)',
            negative: 'var(--negative-color, red)',
            neutral: 'var(--neutral-color, yellow)'
        };

        if (!feedbackMessage) {
            return html``;
        }

        const color = feedbackColorMap[feedbackMessage.type];
        return html`<style>
            .mdc-notched-outline__idle {
                border: 2px solid ${color}!important;
            }

            .feedback-message {
                background-color: ${color};
            }
        </style>`;
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
}

applyMixins(TextInput, [Feedback]);

customElements.define('text-input', TextInput);
