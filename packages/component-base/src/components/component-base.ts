import { html, LitElement } from '@polymer/lit-element/lit-element';
import { TemplateResult } from 'lit-html/lit-html';

export class ComponentBase extends LitElement {
    protected _render(props: LitElement): TemplateResult {
        return html``;
    }
}

customElements.define('component-base', ComponentBase);
