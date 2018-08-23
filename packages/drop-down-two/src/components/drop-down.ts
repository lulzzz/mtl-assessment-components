import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';
import { Persistence } from '@hmh/component-base/dist/mixins/persistence';
// @ts-ignore : no type definition available
// import { MDCSelect } from '@material/select/index.js';

export class DropDown extends ComponentBase implements Persistence {
    public values: string = '';

    static get properties(): { [key: string]: string | object } {
        return {
            values: String
        };
    }

    public onDropDownClicked(): void {
        const dropDown = this.shadowRoot.getElementById('myDropdown')
        dropDown.classList.toggle("show");
        dropDown.focus();
    }

    public onItemClicked(event: MouseEvent, eventTarget: HTMLElement): void {
        if (eventTarget.hasAttribute('slot')) {
            this.shadowRoot.querySelector('.dropbtn').innerHTML = eventTarget.innerHTML;
            this.onDropDownClicked();
        } else {
            this.onItemClicked(event, eventTarget.parentNode as HTMLElement)
        }
    }

    protected _render({ values }: DropDown): TemplateResult {
        return html`

        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        <div class="dropdown">
            <button class="dropbtn" on-click="${(evt: Event) => this.onDropDownClicked()}">Dropdown</button>
            <div id="myDropdown" class="dropdown-content">
                <slot name="options" class="options" on-click="${(evt: MouseEvent) => this.onItemClicked(evt, evt.target as HTMLElement)}"> </slot>
            </div>
        </div>
        `;
    }
}

customElements.define('drop-down', DropDown);
