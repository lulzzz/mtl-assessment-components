import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/index';

/**
 * `<drop-down>`
 * A drop down menu that supports embedded HTML within its option elements.
 * @demo ./demo/index.html
 */
export class DropDown extends ComponentBase<string> {
    public values: string = '';
    public open: boolean = false;
    
    /**
     * value - is currently selected option value.
     * open - is the drop down open.
     * 
     * @returns string
     */
    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            value: String,
            open: Boolean
        };
    }
    
    /**
     * Called when the drop down menu is clicked on.
     * Sets the menu state to open.
     * 
     * @returns void
     */
    private _onDropDownClicked(): void {
        this.open = !this.open;
    }
    
    /**
     * Called when an option item is selected.
     * Sets the element value to that of the selected element.
     * 
     * @param  {HTMLElement} eventTarget
     * @returns void
     */
    private _onItemClicked(eventTarget: HTMLElement): void {
        if (eventTarget.hasAttribute('slot')) {
            this.value = eventTarget.getAttribute('value');
            this._clearAriaSelection();
            // for accessibility (screen readers)
            eventTarget.setAttribute('aria-selected', 'true');
            // set the menu's UI to the content of the currently selected item
            this.shadowRoot.querySelector('.dropbtn').innerHTML = eventTarget.innerHTML;
            this._onDropDownClicked();

            this.dispatchEvent(
                new CustomEvent('change', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        value: this.value
                    }
                })
            );       
        }
    }

    /**
     * Set all the option items 'aria-selected' attributes to false.
     * 
     * @returns void
     */
    private _clearAriaSelection(): void {
        const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach((el: HTMLElement, index: number) => {
                    el.setAttribute('aria-selected', 'false');
                });
            }
        }       
    }

    /**
     * Used to set tabindex and role to option items (for accessibility).
     * 
     * @param  {Event} evt
     * @returns void
     */
    private _onSlotChanged(evt: Event): void {
        const slot: HTMLSlotElement = evt.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach((el: HTMLElement, index: number) => {
                    el.setAttribute('tabindex', String(++index));
                    el.setAttribute('role', 'button');
                });
            }
        }
    }

    /**
     * Sets various accessibility attributes.
     * 
     * @returns void
     */
    private _enableAccessibility(): void {
        this.setAttribute('role', 'popupbutton');
        this.setAttribute('aria-haspopup', 'true');
        this.setAttribute('aria-label', this.shadowRoot.querySelector('.dropbtn').innerHTML);
    }

    /**
     * Called after each render (render called per relevant state change).
     * 
     * @returns void
     */
    protected _didRender(): void {
        this._enableAccessibility();
        this.setAttribute('value', this.value);
    }
    
    /**
     * The template to render.
     * 
     * @param  {} {open - is the drop down open or not
     * @param  {DropDown} value} - the value of the element (value of the currently selected option)
     * @returns TemplateResult
     */
    protected _render({ open, value }: DropDown): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        
        <div class="dropdown" value="${value}">
            <div class="buttons-container">
                <button class="dropbtn" on-click="${(evt: Event) => this._onDropDownClicked()}">Dropdown</button>
                <button class="nav-button" on-click="${(evt: Event) => this._onDropDownClicked()}">&#8595;</button>
            </div>
            <div class="dropdown-content" hidden="${!open}">
                <slot name="options" class="options" 
                on-click="${(evt: MouseEvent) => this._onItemClicked(evt.target as HTMLElement)}"
                on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}"> </slot>
            </div>
        </div>
        `;
    }
}

customElements.define('drop-down', DropDown);
