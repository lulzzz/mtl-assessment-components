import { DropContainer } from './drop-container';
import { ResponseValidation } from '@hmh/component-base';
export { DropContainer } from './drop-container';

/**
 * `<sortable-drop-container>`
 * @demo ./demo/index-sortable-drop-container.html
 */
export class SortableDropContainer extends DropContainer {
    public get value(): string[] {
        return this.addedItems;
    }
    public match(el: ResponseValidation, response: string[]): boolean {
        if (!el.expected) {
            return true;
        }
        const expected: string[] = el.expected.split('|');
        return response.length === expected.length && expected.every((answer: string) => response[expected.indexOf(answer)] === answer);
    }
    public push(hoveredElement: HTMLElement, hiddenElement: HTMLElement): void {
        if (this.isBefore(hoveredElement, hiddenElement)) {
            this.insertBefore(hiddenElement, hoveredElement);
        } else {
            this.insertBefore(hiddenElement, hoveredElement.nextElementSibling);
        }
    }
    private isBefore(node1: Node, node2: Node): boolean {
        for (let cur = node2; cur; cur = cur.previousSibling) {
            if (cur === node1) {
                return true;
            }
        }
        return false;
    }

    protected _onSlotChanged(event: Event): void {
        const items: string[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    if (!el.draggable) {
                        el.draggable = true;
                    }
                    if (!el.classList.contains('option-item')) {
                        el.classList.add('option-item');
                    }
                    el.style.cursor = 'grab';
                    items.push(el.id);
                }
            );
        }
        this.addedItems = items;
    }
}

/* istanbul ignore else */
if (!customElements.get('sortable-drop-container')) {
    customElements.define('sortable-drop-container', SortableDropContainer);
}
