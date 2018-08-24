import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
import { Persistence } from '@hmh/component-base/dist/mixins/persistence';
// @ts-ignore : no type definition available

export class DropDown extends ComponentBase implements Persistence {
    public values: string = '';

    static get properties(): { [key: string]: string | object } {
        return {
            values: String
        };
    }

    private onDropDownClicked(): void {
        const dropDown = this.shadowRoot.getElementById('myDropdown')
        dropDown.classList.toggle("show");
        dropDown.focus();
    }

    private onItemClicked(event: MouseEvent, eventTarget: HTMLElement): void {
        if (eventTarget.hasAttribute('slot')) {
            this.values = eventTarget.getAttribute('value');
            eventTarget.setAttribute('aria-selected', 'true');
            console.log('this.values:', this.values);
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

        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        <div class="dropdown">
            <div class="buttons-container">
                <button class="dropbtn" on-click="${(evt: Event) => this.onDropDownClicked()}">Dropdown</button>
                <div class="nav-buttons-container">
                    <button class="nav-button" on-click="${(evt: Event) => this.onDropDownClicked()}">&#8593</button>
                    <button class="nav-button" on-click="${(evt: Event) => this.onDropDownClicked()}">&#8595</button>
                </div>
            </div>
            <div id="myDropdown" class="dropdown-content">
                <slot name="options" role="option" class="options" on-click="${(evt: MouseEvent) => this.onItemClicked(evt, evt.target as HTMLElement)}"> </slot>
            </div>
        </div>
        `;
    }

    private enableAccessibility(): void {
        this.setAttribute('role', 'popupbutton');
        this.setAttribute('aria-haspopup', 'true');
        this.setAttribute('aria-label', this.shadowRoot.querySelector('.dropbtn').innerHTML);
    }
}

customElements.define('drop-down', DropDown);
