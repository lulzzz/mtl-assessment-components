import { ComponentBase, html, TemplateResult } from '@hmh/component-base';

/**
 * `<short-text>`
 * @demo ./demo/index.html
 */
export class ShortText extends ComponentBase<string> {
    public value: string;

    protected render(): TemplateResult {
        return html``;
    }
}

customElements.define('short-text', ShortText);