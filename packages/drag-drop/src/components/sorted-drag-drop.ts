import {
    applyMixins,
    ComponentBase,
    Feedback,
    FeedbackMessage,
    Strategy,
    html,
    TemplateResult,
    repeat,
    unsafeHTML,
    ResponseValidation
} from '@hmh/component-base/dist/index';
/**
 * `<drag-drop>`
 * @demo ./demo/index.html
 */
export class SortedDragDrop extends ComponentBase<string[]> implements Feedback {
    hasDuplicates: boolean = true;
    value: string[] = [];
    containers: HTMLElement[] = [];
    options: HTMLElement[] = [];
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            hasDuplicates: Boolean,
            options: Array,
            containers: Array,
            value: Array
        };
    }

    // @mixin: feedback
    computeFeedback: (value: string[]) => FeedbackMessage;
    _onFeedbackSlotChanged: (evt: Event) => void;

    /**
     * @param  {ResponseValidation} el - the element containing an expected value and a strategy
     * @param  {any} response - The value to match against
     */
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

    protected _render({ feedbackMessage, options, containers, hasDuplicates, value }: SortedDragDrop): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drag-drop.css">
        <div class$="${feedbackMessage ? feedbackMessage.type : ''}">
            <ol id="op" class="option" ondrop="${(e: DragEvent) => this.drop(e)}" ondragover="${(e: Event) => this.allowDrop(e)}">
                ${repeat(
                    options,
                    (option: HTMLElement) => option.id,
                    (option: HTMLElement) => html`
                        <li class="option-item" id$="${option.id}" draggable="true" ondragstart="${(e: DragEvent) => this.drag(e)}" >
                ${unsafeHTML(option.innerHTML)} </li>`
                )}
            </ol>

            <div id="co" class="container">
                ${repeat(
                    containers,
                    (container: HTMLElement) => container.id,
                    (container: HTMLElement) => html`
                        <div class="container-item"  id$="${container.id}" ondrop="${(e: DragEvent) => this.drop(e)}" ondragover="${(e: Event) =>
                        this.allowDrop(e)}">${unsafeHTML(container.innerHTML)} </div>`
                )}
            <div>

            <slot name="containers" on-slotchange="${(e: Event) => this._onContainersSlotChanged(e)}" ></slot>
            <slot name="options" on-slotchange="${(e: Event) => this._onOptionsSlotChanged(e)}" ></slot>
            <slot name="feedback" on-slotchange="${(e: Event) => this._onFeedbackSlotChanged(e)}"></slot>
        </div>
        `;
    }

    allowDrop(ev: any) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
    }
    drag(ev: DragEvent) {
        ev.dataTransfer.setData('text/plain', (ev.target as HTMLElement).id);
    }
    drop(ev: DragEvent) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData('text/plain');
        if (data && ((ev.target as HTMLElement).className === 'container-item' || (ev.target as HTMLElement).className === 'option')) {
            this.hasDuplicates
                ? (ev.target as HTMLElement).appendChild(this.shadowRoot.getElementById(data))
                : (ev.target as HTMLElement).appendChild(this.shadowRoot.getElementById(data).cloneNode(true));
            this.value.push(data);
        }
        console.log(this.containers);
    }

    _onOptionsSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach(
                    (el: HTMLElement, index: number): void => {
                        el.setAttribute('index', String(index));
                        el.setAttribute('tabindex', String(index + 1));
                        // el.setAttribute('role', 'button');
                        items.push(el);
                    }
                );
            }
        }
        this.options = items;
    }
    _onContainersSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach(
                    (el: HTMLElement, index: number): void => {
                        el.setAttribute('index', String(index));
                        el.setAttribute('tabindex', String(index + 1));
                        //   el.setAttribute('role', 'button');
                        items.push(el);
                    }
                );
            }
        }
        this.containers = items;
    }
    _onItemClicked(arg0: any, arg1: any, arg2: any): any {
        throw new Error('Method not implemented.');
    }
}

applyMixins(SortedDragDrop, [Feedback]);

customElements.define('sorted-drag-drop', SortedDragDrop);
