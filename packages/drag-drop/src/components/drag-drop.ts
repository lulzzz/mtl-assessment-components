import { applyMixins, ComponentBase, Feedback, html, TemplateResult } from '@hmh/component-base/dist/index';
import { DragContainer } from './drag-container';
import { DropContainer } from './drop-container';
import './drop-matt';
/**
 * `<drag-drop>`
 * @demo ./demo/index.html
 */
export class DragDrop extends ComponentBase<string[]> {
    dragContainers: DragContainer[] = [];
    dropContainers: DropContainer[] = [];
    map: Map<string, Set<string>> = new Map();

    constructor() {
        super();
        if (!this.id) {
            this.id = 'drag-drop' + Math.random().toString(16);
        }
        this.addEventListener('drop', this.onDrop);
        this.addEventListener('dragover', this.onDragOver);
        this.addEventListener('dragstart', this.onDragStart);
        this.addEventListener('dragleave', this.onDragLeave);
    }

    public showFeedback(): void {
        this.dropContainers.forEach((d: DropContainer) => d.showFeedback());
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" href="/dist/css/drag-drop.css">
        <div>
            <slot @slotchange=${(e: Event) => this._onSlotChanged(e)}></slot>
        </div>
        `;
    }
    private isDropAllowed(element: HTMLElement): boolean {
        return (
            (element instanceof DragContainer && !element.isDispenser) ||
            (element instanceof DropContainer && (element as DropContainer).maxItems > (element as DropContainer).childrenCount)
        );
    }
    private isSwappable(element: HTMLElement): boolean {
        return element.classList.contains('option-item') && element.parentElement instanceof DropContainer;
    }
    private onDragStart(event: DragEvent) {
        if ((event.target as HTMLElement).className === 'option-item') {
            let type: string;
            let index: number = -1;
            if ((event.target as HTMLElement).parentElement instanceof DragContainer) {
                type = 'drag-container';
                index = this.dragContainers.indexOf((event.target as HTMLElement).parentElement as DragContainer);
            } else if ((event.target as HTMLElement).parentElement instanceof DropContainer) {
                type = 'drop-container';
                index = this.dropContainers.indexOf((event.target as HTMLElement).parentElement as DropContainer);
            }

            event.dataTransfer.setData('source_id', (event.target as HTMLElement).id);
            event.dataTransfer.setData('source_type', type);
            event.dataTransfer.setData('index', index.toString());
            event.dataTransfer.setData('parent-id', this.id);
        }
    }

    private onDragOver(event: DragEvent) {
        if (event.target != this) {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'move';
            (event.target as HTMLElement).classList.add('highlight');
        }
    }
    private onDragLeave(event: DragEvent) {
        (event.target as HTMLElement).classList.remove('highlight');
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
                dataElement = (container as DragContainer).isDispenser
                    ? (container.getElement(sourceId).cloneNode(true) as HTMLElement)
                    : container.getElement(sourceId);
            }

            if (dataElement && this.isDropAllowed(target)) {
                target.add(dataElement, event);
            } else if (this.isSwappable(event.srcElement as HTMLElement)) {
                // if dispenser, modifying a copy has no impact
                console.log('swapping');
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
