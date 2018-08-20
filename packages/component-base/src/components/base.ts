import { LitElement } from '@polymer/lit-element/lit-element';
export { TemplateResult } from 'lit-html/lit-html';
export { html } from '@polymer/lit-element/lit-element';

export class ComponentBase extends LitElement {
    public disabled: boolean = false;

    static get baseProperties(): { [key: string]: string | object } {
        return {
            disabled: Boolean
        };
    }
}
