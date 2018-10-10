import { ComponentBase, html, TemplateResult, property } from '@hmh/component-base';

/**
 * `<drag-container>`
 * @demo ./demo/index-drag-container.html
 */
export class DragContainer extends ComponentBase<string> {
    @property({ type: Boolean, attribute: 'dispenser' })
    isDispenser: boolean = false;
    @property({ type: Array })
    options: string[] = [];
    @property({ type: Boolean, attribute: 'trash' })
    public isTrash: boolean = false;

    public getElement(id: string): HTMLElement {
        return Array.from(this.getElementsByClassName('option-item')).find((x: HTMLElement) => x.id === id) as HTMLElement;
    }
    public add(element: HTMLElement, x?: number, y?: number): void {
        this.appendChild(element);
    }
    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet"href="/css/drag-drop.css">
        <slot name="options" @slotchange=${(e: Event) => this._onSlotChanged(e)} ></slot>
        `;
    }

    private _onSlotChanged(event: Event): void {
        const items: string[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    el.classList.add('option-item');
                    el.draggable = true;
                    if (this.isTrash) el.remove();
                    else if (el.classList.contains('option-item')) {
                        items.push(el.id);
                    }
                }
            );
        }
        this.options = items;
    }
}

customElements.define('drag-container', DragContainer);
