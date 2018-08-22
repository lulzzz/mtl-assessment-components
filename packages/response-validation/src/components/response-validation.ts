import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';

export class ResponseValidation extends ComponentBase {
    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties
        };
    }

    protected _render({  }: ResponseValidation): TemplateResult {
        return html`<slot name="feedback"></slot>`;
    }
}

customElements.define('text-input', ResponseValidation);
