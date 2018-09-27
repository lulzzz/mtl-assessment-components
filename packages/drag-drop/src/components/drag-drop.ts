import { applyMixins, ComponentBase, Feedback, html, TemplateResult, FeedbackMessage } from '@hmh/component-base/dist/index';
import './drag-container';
import './drop-container';
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
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            items: Array
        };
    }

    constructor() {
        super();
        this.addEventListener('drop', this.drop);
        this.addEventListener('dragover', this.allowDrop);
        this.addEventListener('dragstart', this.drag);
    }

    public showFeedback(): void {
        this.dropContainers.forEach((d) => d.showFeedback());
    }

    public getFeedback(): FeedbackMessage {
        return this.feedbackMessage;
    }

    public getValue(): string[] {
        return this.value;
    }

    protected _render({ feedbackMessage }: DragDrop): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drag-drop.css">
        <div class$="${feedbackMessage ? feedbackMessage.type : ''}">
            <slot on-slotchange="${(e: Event) => this._onSlotChanged(e)}"></slot>
        </div>
        `;
    }
    isDropAllowed(element: HTMLElement): boolean {
        return element instanceof DragContainer || (element as DropContainer).maxItems > (element as DropContainer).childrenNb;
    }
    allowDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
    }
    drag(event: DragEvent) {
        if ((event.target as HTMLElement).className === 'option-item') {
            event.dataTransfer.setData('source_id', (event.target as HTMLElement).id);
        }
    }

    drop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        const target: HTMLElement = event.target as HTMLElement;
        if (target !== this) {
            //do not allow drop of drag-drop itself

            var data = event.dataTransfer.getData('source_id');
            let dataElement: HTMLElement;

            //Look for id in drag and drop arrays (prevents external drag items to be added) TODO: check element belongs
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
    }
    _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach(
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
}

applyMixins(DragDrop, [Feedback]);

customElements.define('drag-drop', DragDrop);
