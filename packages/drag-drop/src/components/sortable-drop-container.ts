import { DropContainer } from './drop-container';
import { ResponseValidation, Strategy } from '@hmh/component-base';

/**
 * `<sortable-drag-container>`
 * @demo ./demo/index-sortable-drag-container.html
 */
export class SortableDropContainer extends DropContainer {
    public match(el: ResponseValidation, response: string[]): boolean {
        if (!el.expected) {
            // catch-all clausec
            return true;
        }
        const expected: string[] = el.expected.split('|');

        switch (el.strategy) {
            case Strategy.CONTAINS:
                return expected.some((answer: string) => response.includes(answer));
            case Strategy.EXACT_MATCH:
            default:
                return response.length === expected.length && expected.every((answer: string) => response.includes(answer));
        }
    }

    public add(element: HTMLElement, x: number, y: number): void {
        element.style.left = x.toString();
        element.style.top = y.toString();
        this.appendChild(element);
    }
    public push(hoveredElement: HTMLElement, hiddenElement: HTMLElement): void {
        if (this.isbefore(hoveredElement, hiddenElement)) {
            this.insertBefore(hiddenElement, hoveredElement);
        } else {
            this.insertBefore(hiddenElement, hoveredElement.nextElementSibling);
        }
    }
    isbefore(node1: Node, node2: Node): boolean {
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
                    el.classList.add('option-item');
                    el.draggable = true;
                    if (el.classList.contains('option-item')) {
                        items.push(el.id);
                    }
                }
            );
        }
        this.addedItems = items; //TODO: Add index somehow
    }
}

customElements.define('sortable-drop-container', SortableDropContainer);
