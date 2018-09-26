import { ComponentBase, html, TemplateResult, repeat, unsafeHTML } from '@hmh/component-base/dist/index';
/**
 * `<drag-drop>`
 * @demo ./demo/index.html
 */
export class DragContainer extends ComponentBase<string[]> {
    hasDuplicates: boolean = true;
    value: string[] = [];
    options: HTMLElement[] = [];

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            hasDuplicates: Boolean,
            options: Array,
            value: Array
        };
    }

    protected _render({ options, hasDuplicates, value }: DragContainer): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drag-drop.css">
        ${repeat(
            options,
            (option: HTMLElement) => option.id,
            (option: HTMLElement) => html`
                <div class="option-item" slot="option-item" id$="${option.id}" draggable="true" ondragstart="${(e: DragEvent) => this.drag(e)}" > ${unsafeHTML(
                option.innerHTML
            )} </div>`
        )}

        <slot name="options" on-slotchange="${(e: Event) => this._onSlotChanged(e)}" ></slot>
        `;
    }

    drag(ev: DragEvent) {
        ev.stopPropagation();
        if ((ev.target as HTMLElement).className === 'option-item') {
            ev.dataTransfer.setData('source_id', (ev.target as HTMLElement).id);
        }
    }

    _onSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach(
                    (el: HTMLElement): void => {
                        items.push(el);
                    }
                );
            }
        }
        this.options = items;
    }
}

customElements.define('drag-container', DragContainer);
