import { html, TemplateResult } from '@hmh/component-base/dist/index';
import { LitElement } from '../../node_modules/@polymer/lit-element/lit-element';

/**
 * `<drag-container>`
 * @demo ./demo/index-drag-container.html
 */
export class DragContainer extends LitElement {
    hasDuplicates: boolean = true;
    options: HTMLElement[] = [];

    static get properties(): { [key: string]: string | object } {
        return {
            hasDuplicates: Boolean,
            options: Array
        };
    }

    protected _render({ options, hasDuplicates }: DragContainer): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drag-drop.css">
        <slot name="options" on-slotchange="${(e: Event) => this._onSlotChanged(e)}" ></slot>
        `;
    }

    _onSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach(
                    (el: HTMLElement): void => {
                        el.className = 'option-item';
                        el.draggable = true;
                        items.push(el);
                    }
                );
            }
        }
        this.options = items;
    }
}

customElements.define('drag-container', DragContainer);
