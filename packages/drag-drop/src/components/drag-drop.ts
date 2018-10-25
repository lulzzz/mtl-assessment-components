import { applyMixins, ComponentBase, Feedback, html, TemplateResult, property } from '@hmh/component-base';
import { DragContainer } from './drag-container.js';
import { DropContainer, SortableDropContainer } from './sortable-drop-container';

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
        this.addEventListener('drop', this.onDrop.bind(this));
        this.addEventListener('dragover', this.onDragOver.bind(this));
        this.addEventListener('dragstart', this.onDragStart.bind(this));
        this.addEventListener('dragleave', this.onDragLeave.bind(this));
        this.addEventListener('dragend', this.onDragEnd.bind(this));
    }

    public showFeedback(): void {
        this.dropContainers.forEach((d: DropContainer) => d.showFeedback());
    }

    protected render(): TemplateResult {
        return html`
         <link rel="stylesheet" href="/css/drag-drop.css">
        <slot @slotchange=${(e: Event) => this._onSlotChanged(e)}></slot>

        `;
    }

    private isOptionSwappable(element: HTMLElement): boolean {
        return element.classList.contains('option-item') && element.parentElement instanceof DropContainer && this.swappable;
    }
    private async onDragStart(event: DragEvent) {
        if ((event.target as HTMLElement).className === 'option-item') {
            const current: HTMLElement = event.target as HTMLElement;
            this.currentElement = current;
            event.dataTransfer.effectAllowed = 'move';
            this.offsetX = event.x - this.currentElement.offsetLeft;
            this.offsetY = event.y - this.currentElement.offsetTop;
            let type: string;
            let index: number = -1;
            if (this.currentElement.parentElement instanceof DragContainer) {
                type = 'drag-container';
                index = this.dragContainers.indexOf(this.currentElement.parentElement as DragContainer);
            } else {
                type = 'drop-container';
                index = this.dropContainers.indexOf(this.currentElement.parentElement as DropContainer);
            }
            if (!(this.currentElement.parentElement as DragContainer).dispenser) {
                setTimeout(() => {
                    // switch to global scope
                    current.style.visibility = 'hidden';
                }, 0);
            }
            event.dataTransfer.setData('source_id', this.currentElement.id);
            event.dataTransfer.setData('source_type', type);
            event.dataTransfer.setData('index', index.toString());
            event.dataTransfer.setData('parent-id', this.id);
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
        (event.target as HTMLElement).style.visibility = 'visible';
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
            /* istanbul ignore next */
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

        slot.assignedNodes().forEach(
            (el: HTMLElement): void => {
                this.collectContainers(el);
            }
        );
    }

    private collectContainers(el: HTMLElement): void {
        if (el instanceof DragContainer) {
            this.dragContainers.push(el as DragContainer);
        } else if (el instanceof DropContainer) {
            this.dropContainers.push(el as DropContainer);
        } else if (typeof el.querySelectorAll === 'function') {
            el.querySelectorAll('drop-container').forEach(
                (container: HTMLElement): void => {
                    this.dropContainers.push(container as DropContainer);
                }
            );
            el.querySelectorAll('drag-container').forEach(
                (container: HTMLElement): void => {
                    this.dragContainers.push(container as DragContainer);
                }
            );
        }
    }
}

applyMixins(DragDrop, [Feedback]);

customElements.define('drag-drop', DragDrop);
