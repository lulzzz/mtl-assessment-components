import { LitElement } from '@polymer/lit-element/lit-element';
export { TemplateResult } from 'lit-html/lit-html';
export { html } from '@polymer/lit-element/lit-element';
export { repeat } from 'lit-html/lib/repeat';
export { unsafeHTML } from 'lit-html/lib/unsafe-html';

export enum Mode {
    INTERACTIVE = 'interactive',
    READONLY = 'readonly',
    RESOLVED = 'resolved'
}

export class ComponentBase<T> extends LitElement {
    public disabled: boolean = false;
    public mode: Mode = Mode.INTERACTIVE;
    public value: T;

    static get properties(): { [key: string]: string | object } {
        return {
            disabled: Boolean
        };
    }

    public getValue(): T {
        return this.value;
    }
}
