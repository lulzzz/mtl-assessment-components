import { ComponentBase, html, TemplateResult, property } from '@hmh/component-base';

/**
 * `<drag-container>`
 * @demo ./demo/index-drag-container.html
 */
export class DragContainer extends ComponentBase<string> {
    @property({ type: Boolean, attribute: 'dispenser' })
    dispenser: boolean = false;
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
    public isDropAllowed(): boolean {
        return !this.dispenser;
    }

    protected render(): TemplateResult {
        return html`
        <slot name="options" @slotchange=${(e: Event) => this._onSlotChanged(e)} ></slot>
        `;
    }

    private _onSlotChanged(event: Event): void {
        const items: string[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;

        slot.assignedNodes().forEach(
            (el: HTMLElement): void => {
                if (!el.draggable) {
                    el.draggable = true;
                }
                if (!el.classList.contains('option-item')) {
                    el.classList.add('option-item');
                }
                el.style.position = 'initial';
                el.style.cursor = 'grab';
                // make sure internal block elements are not draggable on their own
                el.querySelectorAll('*').forEach((el: HTMLElement) => el.setAttribute('draggable', 'false'));

                if (this.isTrash) el.remove();
                else items.push(el.id);
            }
        );

        this.options = items;
    }


}

customElements.define('drag-container', DragContainer);
