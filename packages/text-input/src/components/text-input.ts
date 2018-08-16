import { applyMixins, ComponentBase, Feedback, html, Persistence, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index';

export class TextInput extends ComponentBase implements Feedback, Persistence {
    public feedbackText: string;
    public placeholder: string = 'enter some text';
    public value: string = '';

    // declare mixins properties to satisfy the typescript compiler
    public showFeedback: () => void;

    static get properties(): { [key: string]: string | object } {
        return {
            feedbackText: String,
            placeholder: String,
            value: String
        };
    }

    public _firstRendered(): void {
        new MDCTextField(this.shadowRoot.querySelector('.mdc-text-field'));
    }

    protected _render({ feedbackText, placeholder, value }: TextInput): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/text-input.css">
        <div class="mdc-text-field mdc-text-field--outlined">
            <input type="text" id="tf-outlined" class="mdc-text-field__input" value="${value}" placeholder="${placeholder}">
            <div class="mdc-notched-outline">
                <svg>
                <path class="mdc-notched-outline__path"/>
                </svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>
        </div>
        <span>${feedbackText}</span>
        `;
    }
}

applyMixins(TextInput, [Feedback, Persistence]);

customElements.define('text-input', TextInput);
