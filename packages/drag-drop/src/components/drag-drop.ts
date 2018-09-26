import { applyMixins, ComponentBase, Feedback, FeedbackMessage, Strategy, html, TemplateResult, ResponseValidation } from '@hmh/component-base/dist/index';
import './drag-container';
import './drop-container';
import { DragContainer } from './drag-container';
import { DropContainer } from './drop-container';
/**
 * `<drag-drop>`
 * @demo ./demo/index.html
 */
export class DragDrop extends ComponentBase<string[]> implements Feedback {
    value: string[] = [];
    dragContainers: DragContainer[] = [];
    dropContainers: DropContainer[] = [];
    map: Map<string, Set<string>> = new Map();
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            items: Array,
            value: Array
        };
    }

    // @mixin: feedback
    computeFeedback: (value: string[]) => FeedbackMessage;
    _onFeedbackSlotChanged: (evt: Event) => void;
    constructor() {
        super();
        this.addEventListener('drop', this.drop);
        this.addEventListener('dragover', this.allowDrop);
        this.addEventListener('dragstart', this.drag);
    }

    /**
     * Call this function to display feedback to the user
     */
    public showFeedback(): void {
        this.dropContainers.forEach((d) => d.showFeedback());
    }

    public match(el: ResponseValidation, response: string[]): boolean {
        if (!el.expected) {
            // catch-all clause
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

    protected _render({ feedbackMessage, value }: DragDrop): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drag-drop.css">
        <div class$="${feedbackMessage ? feedbackMessage.type : ''}">
            <slot on-slotchange="${(e: Event) => this._onSlotChanged(e)}"></slot>
            <slot name="feedback" on-slotchange="${(e: Event) => this._onFeedbackSlotChanged(e)}"></slot>
        </div>
        `;
    }
    isDropAllowed(element: HTMLElement, id: string): boolean {
        return element instanceof DragContainer || (element as DropContainer).maxItems > (element as DropContainer).childrenNb;
    }
    allowDrop(ev: any) {
        ev.preventDefault();
        ev.stopPropagation();
        ev.dataTransfer.dropEffect = 'move';
    }
    drag(ev: DragEvent) {
        if ((ev.target as HTMLElement).className === 'option-item') {
            ev.dataTransfer.setData('source_id', (ev.target as HTMLElement).id);
        }
    }

    drop(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();

        const target: HTMLElement = ev.target as HTMLElement;
        if (target !== this) {
            //do not allow drop of drag-drop itself

            var data = ev.dataTransfer.getData('source_id');
            let dataElement: HTMLElement;

            //Look for id in drag and drop arrays (prevents external drag items to be added) TODO: check element belongs
            this.dragContainers.forEach((d: DragContainer) => {
                d.options.forEach((o: HTMLElement) => {
                    if (o.id === data) dataElement = o;
                });
            });
            this.dropContainers.forEach((d: DropContainer) => {
                d.addedItems.forEach((o: HTMLElement) => {
                    if (o.id === data) dataElement = o;
                });
            });

            if (dataElement && this.isDropAllowed(target, data)) {
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
