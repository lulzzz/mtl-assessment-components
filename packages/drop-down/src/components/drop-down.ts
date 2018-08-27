import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
// @ts-ignore : no type definition available

export class DropDown extends ComponentBase {
    public values: string = '';
    public open: boolean;

    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            values: String,
            open: Boolean
        };
    }

    private onDropDownClicked(): void {
        this.open = !this.open;
    }

    private onItemClicked(event: MouseEvent, eventTarget: HTMLElement): void {
        if (eventTarget.hasAttribute('slot')) {
            this.values = eventTarget.getAttribute('value');
            eventTarget.setAttribute('aria-selected', 'true');
            this.shadowRoot.querySelector('.dropbtn').innerHTML = eventTarget.innerHTML;
            this.onDropDownClicked();
        } else {
            this.onItemClicked(event, eventTarget.parentNode as HTMLElement)
        }
    }

    protected _didRender(): void {
        this.enableAccessibility();
    }

    protected _render({ values }: DropDown): TemplateResult {
        return html`
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">

        <div class="dropdown">
            <div class="buttons-container">
                <button class="dropbtn" on-click="${(evt: Event) => this.onDropDownClicked()}">Dropdown</button>
                <div class="nav-buttons-container">
                <button class="nav-button material-icons" on-click="${(evt: Event) => this.onDropDownClicked()}">arrow_drop_down</button>
            </div>
            <div id="myDropdown" class$="dropdown-content ${this.open ? 'show' : ''}">
                <slot name="options" class="options" 
                on-click="${(evt: MouseEvent) => this.onItemClicked(evt, evt.target as HTMLElement)}"
                on-slotchange="${(evt: Event) => this.onSlotChanged(evt)}"> </slot>
            </div>
        </div>
        `;
    }
    // mdc-select-dd-arrow-svg-bg_
    private onSlotChanged(evt: Event) : any {
        const slot: HTMLSlotElement = evt.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach((el: HTMLElement, index: number) => {
                    el.setAttribute('tabindex', String(index));
                    el.setAttribute('role', 'button');
                    ++index;
                });
            }
        }
    }

    private enableAccessibility(): void {
        this.setAttribute('role', 'popupbutton');
        this.setAttribute('aria-haspopup', 'true');
        this.setAttribute('aria-label', this.shadowRoot.querySelector('.dropbtn').innerHTML);
    }
}

customElements.define('drop-down', DropDown);
