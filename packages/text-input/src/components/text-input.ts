import { html, LitElement } from '@polymer/lit-element/lit-element';
import { TemplateResult } from 'lit-html/lit-html';

export class TextInput extends LitElement {
    public placeholder: string = 'enter some text';
    public value: string = '';

    static get properties(): { [key: string]: string | object } {
        return {
            placeholder: String,
            value: String
        };
    }

    protected _render({ placeholder, value }: TextInput): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="../../node_modules/@material/textfield/dist/mdc.textfield.css">
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
}

customElements.define('text-input', TextInput);
