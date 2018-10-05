import { ComponentBase, property } from './base'
import { scaleLinear } from 'd3-scale';

export enum Direction {
    X = 'X',
    Y = 'Y',
    Z = 'Z'
};

export abstract class GraphBase extends ComponentBase<any> {
    @property({ type: Array })
    public value: any;
    @property({ type: Array })
    protected items: HTMLElement[] = [];
    protected graphSize: number = 500;
    protected svgContainer: any = null;
    protected rendered: boolean = false;

    /**
     * Return a d3.scale function
     * 
     * @param  {Direction} axis X or Y
     * @returns d3.ScaleLinear
     */
    protected scale(axis: Direction, min: number, max: number ): d3.ScaleLinear<number, number> {
        const domain = [min, max];
        const range = (axis === Direction.X ? [0, this.graphSize] : [this.graphSize, 0]);

        return scaleLinear()
        .domain(domain) // input
        .range(range); // output
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
    }
}
