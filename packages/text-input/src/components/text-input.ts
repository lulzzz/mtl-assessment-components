import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/components/component-base';
import { FeedbackMixin } from '@hmh/component-base/dist/components/feedback-mixin';
import { PersistenceMixin } from '@hmh/component-base/dist/components/persistence-mixin';

// @ts-ignore : no type definition available
import { MDCTextField } from '@material/textfield/index.js';

export class TextInput extends ComponentBase implements FeedbackMixin, PersistenceMixin {
    public feedbackText: string;
    public placeholder: string = 'enter some text';
    public value: string = '';

    static get properties(): { [key: string]: string | object } {
        return {
            feedbackText: String,
            placeholder: String,
            value: String
        };
    }

    public showFeedback(): void {
        this.feedbackText = 'some feedback';
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

customElements.define('text-input', TextInput);
