import { ComponentBase, html, TemplateResult, Feedback, applyMixins, repeat, unsafeHTML } from '@hmh/component-base/dist/index';
/**
 * `<multiple-choice>`
 * In typical use, use `<multiple-choice>`
 * @param mode
 * @demo ./demo/index.html
 *
 */
export class MultipleChoice extends ComponentBase implements Feedback {
    private items: HTMLElement[] = [];
    private mode: string;
    public feedbackText: string;
    public values: string = '';
    public showFeedback: () => void;

    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            items: Array,
            mode: String,
            values: String
        };
    }

    protected _render({ mode, items }: MultipleChoice): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/radio/dist/mdc.radio.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/form-field/dist/mdc.form-field.css">
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/checkbox/dist/mdc.checkbox.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/multiple-choice.css">
    <main>
       ${repeat(
           items,
           (item: HTMLElement) => item.id,
           (item: HTMLElement) => html`
            <div hidden class="mdc-form-field"> ${mode === 'multiple' ? this.renderCheckbox(item) : this.renderRadioButton(item)}
                <label for$="${item.id}"> ${unsafeHTML(item.innerHTML)} </label>
            </div>`
       )}
        <slot name="options" on-slotchange="${(e: Event) => this.slotChanged(e)}" ></slot>
    </main>
        `;
    }
    private renderCheckbox(item: HTMLElement): TemplateResult {
        return html`
        <div class="mdc-checkbox" on-click="${(evt: MouseEvent) => this.onItemClicked(evt, item.id)}">
        <input type="checkbox" class="mdc-checkbox__native-control" id="${item.id}"/>
        <div class="mdc-checkbox__background">
            <svg class="mdc-checkbox__checkmark"
               viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
            </svg>
            <div class="mdc-checkbox__mixedmark"></div>
        </div>
      </div>`;
    }
    private renderRadioButton(item: HTMLElement): TemplateResult {
        return html`
        <div class="mdc-radio" on-click="${(evt: MouseEvent) => this.onItemClicked(evt, item.id)}">
         <input class="mdc-radio__native-control" type="radio" id="${item.id}" name="options">
         <div class="mdc-radio__background">
         <div class="mdc-radio__outer-circle"></div>
         <div class="mdc-radio__inner-circle"></div>
         </div>
     </div>`;
    }
    /**
     * @param event
     */
    private onItemClicked(event: MouseEvent, id: string): void {
        event.stopPropagation();
        console.log('clicked on id:', id);
    }

    /**
     * @param event
     */
    private slotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                for (const el of nodes as HTMLElement[]) {
                    items.push(el);
                }
            }
        }
        this.items = items;
    }
}

applyMixins(MultipleChoice, [Feedback]);

customElements.define('multiple-choice', MultipleChoice);
