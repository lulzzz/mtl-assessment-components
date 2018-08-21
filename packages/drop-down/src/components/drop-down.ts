import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
import { PersistenceMixin } from '@hmh/component-base/dist/components/persistence-mixin';
// @ts-ignore : no type definition available
import { MDCSelect } from '@material/select/index.js';

export class DropDown extends ComponentBase implements PersistenceMixin {
    public values: string = '';

    static get properties(): { [key: string]: string | object } {
        return {
            values: String
        };
    }

    public showFeedback(): void {
        this.feedbackText = 'some feedback';
    }

    public _firstRendered(): void {
        const select = new MDCSelect(this.shadowRoot.querySelector('.mdc-select'));
        select.listen('change', () => {
          alert(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
        });
    }

    protected _render({ values }: DropDown): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/select/dist/mdc.select.css">
            <div class="mdc-select mdc-select--outlined">
                <select class="mdc-select__native-control"></select>
                <div class="mdc-notched-outline">
                    <svg>
                    <path class="mdc-notched-outline__path"></path>
                    </svg>
                </div>
                <div class="mdc-notched-outline__idle"></div>
                <slot name="options" on-slotchange="${(e: Event) => this.slotChanged(e)}"></slot>
             </div>
        `;
    }

    /**
     * Update the UI whenever nodes are added or removed from the slot
     * Adding options to select here because slots aren't suppoerted for select elements:
     * https://github.com/vuejs/vue/issues/1962
     * 
     * @param event
     */
    private slotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        const select: HTMLSelectElement = this.shadowRoot.querySelector('select');
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                this.count = nodes.length;
                for (const el of nodes as HTMLElement[]) {
                    select.appendChild(el);
                }
            }
        }
    }
}

customElements.define('drop-down', DropDown);
