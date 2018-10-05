import { ComponentBase, html, TemplateResult, property } from '@hmh/component-base';

/**
 * `<drag-container>`
 * @demo ./demo/index-drag-container.html
 */
export class DragContainer extends ComponentBase<string> {
    @property({ type: Boolean, reflect: true })
    dispenser: boolean = false;
    @property({ type: Array })
    options: string[] = [];

    public getElement(id: string): HTMLElement {
        return Array.from(this.getElementsByClassName('option-item')).find((x: HTMLElement) => x.id === id) as HTMLElement;
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet"href="/dist/css/drag-drop.css">
        <slot name="options" @slotchange=${(e: Event) => this._onSlotChanged(e)} ></slot>
        `;
    }

    private _onSlotChanged(event: Event): void {
        const items: string[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    el.className = 'option-item';
                    el.draggable = true;
                    items.push(el.id);
                }
            );
        }
        this.options = items;
    }
}

customElements.define('drag-container', DragContainer);
