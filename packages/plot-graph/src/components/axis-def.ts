import { html, TemplateResult, GraphBase, Direction } from '@hmh/component-base';

/**
 * `<axis-def>`
 * @demo ./demo/index.html
 */
export class AxisDef extends GraphBase {
    private axisSize: number = 25;
    public value: any = [];

    private addAxis(axis: HTMLElement): void {        
        const dir = axis.getAttribute('direction');
        var direction = (dir === 'x' ? Direction.X : dir === 'y' ? Direction.Y : Direction.Z);
        const min = axis.getAttribute('min');
        const max = axis.getAttribute('max');
        const scale = this.scale(direction, parseInt(min), parseInt(max));
        const translationX = 'translate(0,'+(this.graphSize - this.axisSize)+')';
        const translationY = 'translate('+this.axisSize+',0)';

        this.value.push({ direction: direction, min: min, max: max, scale: scale, translationX: translationX, translationY: translationY });
    }

    protected render(): TemplateResult {
        return html`
        <slot hidden name="axis" class="options" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        `;
    }

     /**
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    this.addAxis(el);
                }
            );
        }
    }
}

customElements.define('axis-def', AxisDef);
