import { html, TemplateResult, ComponentBase } from './base.js';

/**
 * `<coordinate-system>`
 * @demo ./demo/index.html
 */
export class CoordinateSystem extends ComponentBase<HTMLElement[]> {
    public value: HTMLElement[] = [];

    protected render(): TemplateResult {
        return html`
        <slot hidden name="axis" class="axis" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        `;
    }

    /**
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        slot.assignedNodes().forEach(
            (el: HTMLElement): void => {
                this.value.push(el);
            }
        );
    }
}

customElements.define('coordinate-system', CoordinateSystem);
