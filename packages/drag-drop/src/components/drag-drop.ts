import { applyMixins, ComponentBase, Feedback, html, TemplateResult } from '@hmh/component-base/dist/index';
import { DragContainer } from './drag-container';
import { DropContainer } from './drop-container';
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
        this.addEventListener('drop', this.onDrop);
        this.addEventListener('dragover', this.onDragOver);
        this.addEventListener('dragstart', this.onDragStart);
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
            element instanceof DragContainer ||
            (element instanceof DropContainer && (element as DropContainer).maxItems > (element as DropContainer).childrenCount)
        );
    }
    private onDragStart(event: DragEvent) {
        if ((event.target as HTMLElement).className === 'option-item') {
            event.dataTransfer.setData('source_id', (event.target as HTMLElement).id);
        }
    }

    private onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
    }

    private onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        const target: HTMLElement = event.target as HTMLElement;
        const data = event.dataTransfer.getData('source_id');
        let dataElement: HTMLElement;

        this.dragContainers.forEach((d: DragContainer) => {
            if (d.options.includes(data)) dataElement = d.getElement(data);
        });
        this.dropContainers.forEach((d: DropContainer) => {
            if (d.addedItems.includes(data)) dataElement = d.getElement(data);
        });

        if (dataElement && this.isDropAllowed(target)) {
            target.appendChild(dataElement);
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
