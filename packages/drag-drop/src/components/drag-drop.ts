import { applyMixins, ComponentBase, Feedback, html, TemplateResult, property } from '@hmh/component-base';
import { DragContainer } from './drag-container.js';
import { DropContainer } from './drop-container.js';
import './sortable-drop-container';
import { SortableDropContainer } from './sortable-drop-container';

/**
 * `<drag-drop>`
 * @demo ./demo/index.html
 */
export class DragDrop extends ComponentBase<string[]> {
    @property({ type: Boolean })
    public swappable: boolean = false;
    private dragContainers: DragContainer[] = [];
    private dropContainers: DropContainer[] = [];
    private offsetX: number;
    private offsetY: number;
    private currentElement: HTMLElement;
    constructor() {
        super();
        if (!this.id) {
            this.id = 'drag-drop' + Math.random().toString(16);
        }
        this.addEventListener('drop', this.onDrop);
        this.addEventListener('dragover', this.onDragOver);
        this.addEventListener('dragstart', this.onDragStart);
        this.addEventListener('dragleave', this.onDragLeave);
        this.addEventListener('dragend', this.onDragEnd);
    }

    public showFeedback(): void {
        this.dropContainers.forEach((d: DropContainer) => d.showFeedback());
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" href="/css/drag-drop.css">
        <div>
            <slot @slotchange=${(e: Event) => this._onSlotChanged(e)}></slot>
        </div>
        `;
    }
    private isOptionSwappable(element: HTMLElement): boolean {
        return element.classList.contains('option-item') && element.parentElement instanceof DropContainer && this.swappable;
    }
    private onDragStart(event: DragEvent) {
        if ((event.target as HTMLElement).className === 'option-item') {
            event.dataTransfer.effectAllowed = 'move';
            this.offsetX = event.x - (event.target as HTMLElement).offsetLeft;
            this.offsetY = event.y - (event.target as HTMLElement).offsetTop;
            let type: string;
            let index: number = -1;
            if ((event.target as HTMLElement).parentElement instanceof DragContainer) {
                type = 'drag-container';
                index = this.dragContainers.indexOf((event.target as HTMLElement).parentElement as DragContainer);
            } else if ((event.target as HTMLElement).parentElement instanceof DropContainer) {
                type = 'drop-container';
                index = this.dropContainers.indexOf((event.target as HTMLElement).parentElement as DropContainer);
            }
            if (!((event.target as HTMLElement).parentElement as DragContainer).dispenser) {
                setTimeout(function() {
                    (event.target as HTMLElement).classList.add('hide');
                }, 0);
            }
            event.dataTransfer.setData('source_id', (event.target as HTMLElement).id);
            event.dataTransfer.setData('source_type', type);
            event.dataTransfer.setData('index', index.toString());
            event.dataTransfer.setData('parent-id', this.id);
            this.currentElement = event.target as HTMLElement;
        }
    }

    private onDragOver(event: DragEvent) {
        if (event.target != this && this.currentElement) {
            event.preventDefault();
            event.stopPropagation();
            if (!(event.target as HTMLElement).classList.contains('option-item') || this.swappable) (event.target as HTMLElement).classList.add('highlight');
            else {
                const sortableDrop: SortableDropContainer = (event.target as HTMLElement).parentElement as SortableDropContainer;
                if (sortableDrop instanceof SortableDropContainer) {
                    sortableDrop.push(event.target as HTMLElement, this.currentElement);
                }
            }
        }
    }
    private onDragLeave(event: DragEvent) {
        (event.target as HTMLElement).classList.remove('highlight');
    }
    private onDragEnd(event: DragEvent) {
        event.stopPropagation();
        (event.target as HTMLElement).classList.remove('hide');
        this.currentElement = null;
    }

    private onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        const target: DragContainer | DropContainer = event.target as DragContainer | DropContainer;
        target.classList.remove('highlight');

        const sourceId = event.dataTransfer.getData('source_id');
        const type = event.dataTransfer.getData('source_type');
        const parentId = event.dataTransfer.getData('parent-id');
        const index: number = Number(event.dataTransfer.getData('index'));
        let dataElement: HTMLElement;
        let container: DragContainer | DropContainer;
        container = type === 'drop-container' ? this.dropContainers[index] : this.dragContainers[index];
        if (this.id === parentId) {
            if (container) {
                dataElement = (container as DragContainer).dispenser
                    ? (container.getElement(sourceId).cloneNode(true) as HTMLElement)
                    : container.getElement(sourceId);
            }
            if (dataElement && (target instanceof DragContainer || target instanceof DropContainer) && target.isDropAllowed()) {
                target.add(dataElement, event.x - this.offsetX, event.y - this.offsetY);
            } else if (this.isOptionSwappable(event.srcElement as HTMLElement)) {
                // if dispenser, modifying a copy has no impact
                const placeHolder: string = dataElement.innerHTML;
                dataElement.innerHTML = event.srcElement.innerHTML;
                event.srcElement.innerHTML = placeHolder;
            }
        }
    }
    private _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    if (el instanceof DragContainer) {
                        this.dragContainers.push(el as DragContainer);
                    }
                    if (el instanceof DropContainer) {
                        this.dropContainers.push(el as DropContainer);
                    }
                }
            );
        }
    }
}

applyMixins(DragDrop, [Feedback]);

customElements.define('drag-drop', DragDrop);
