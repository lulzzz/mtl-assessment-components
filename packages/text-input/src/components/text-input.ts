import { LitElement } from '@polymer/lit-element/lit-element';
import { html, TemplateResult } from 'lit-html/lit-html';

// @ts-ignore
import { MDCTextField } from '@material/textfield/index';

export class TextInput extends LitElement {
    public placeholder: string = 'enter some text';
    public value: string = '';
    public shadowRoot: ShadowRoot;
    private textField: any;

    //FeedbackMixin
    foo: (x: number) => number;

    static get properties(): { [key: string]: string | object } {
        return {
            placeholder: String,
            value: String
        };
    }

    protected _render({ placeholder, value }: TextInput): TemplateResult {
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
        `;
    }

    protected _didRender(): void {
        if (!this.textField) {
            this.textField = new MDCTextField(this.shadowRoot.querySelector('.mdc-text-field'));
        }
    }
}

customElements.define('text-input', TextInput);
