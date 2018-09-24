import { ComponentBase, html, TemplateResult, repeat, unsafeHTML } from '@hmh/component-base/dist/index';
/**
 * `<drag-drop>`
 * @demo ./demo/index.html
 */
export class DropContainer extends ComponentBase<string[]> {
    hasDuplicates: boolean = true;
    value: string[] = [];
    public addedElements: string[] = [];

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            addedElements: Array,
            hasDuplicates: Boolean,
            containers: Array,
            value: Array
        };
    }

    protected _render({ hasDuplicates, value }: DropContainer): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drag-drop.css">
   ${unsafeHTML(this.innerHTML)}

        `;
    }
}

customElements.define('drop-container', DropContainer);
