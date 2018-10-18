import { DropContainer } from './drop-container';
import { ResponseValidation } from '@hmh/component-base';

/**
 * `<sortable-drag-container>`
 * @demo ./demo/index-sortable-drag-container.html
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
