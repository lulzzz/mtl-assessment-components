import { html, TemplateResult, GraphBase } from '@hmh/component-base';

/**
 * `<axis-def>`
 * @demo ./demo/index.html
 */
export class AxisDef extends GraphBase {
    // this element exists only to serve as an input structure for axis-def
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
        if (slot) {
            const items: HTMLElement[] = [];
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    items.push(el);
                }
            );

            this.items = items;
        }



        this.value = this.items;
    }

}

customElements.define('axis-def', AxisDef);