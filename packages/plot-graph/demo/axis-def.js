var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { html, property, GraphBase, Direction } from '@hmh/component-base/dist/index';
import * as d3 from 'd3';
/**
 * `<axis-def>`
 * @demo ./demo/index.html
 */
export class AxisDef extends GraphBase {
    constructor() {
        super(...arguments);
        this.axisSize = 25;
    }
    addAxis(axis) {
        console.log('addAxis');
        const dir = axis.getAttribute('direction');
        var direction = (dir === 'x' ? Direction.X : dir === 'y' ? Direction.Y : Direction.Z);
        const min = axis.getAttribute('min');
        const max = axis.getAttribute('max');
        const scale = this.scale(direction, parseInt(min), parseInt(max));
        // Call the X and Y axes in a group tag
        const translationX = 'translate(0,' + (this.graphSize - this.axisSize) + ')';
        const translationY = 'translate(' + this.axisSize + ',0)';
        // Call the x axis in a group tag
        this.svgContainer
            .append('g')
            .attr('class', direction === Direction.X ? 'x-axis' : 'y-axis')
            .attr('transform', direction === Direction.X ? translationX : translationY)
            .call(direction === Direction.X ? d3.axisBottom(scale) : d3.axisLeft(scale)); // Create an axis component with d3.axisBottom
    }
    render() {
        return html `
        <link rel="stylesheet" type="text/css" href="/dist/css/axis-def.css">
            <div id="canvas"></div>
        <slot hidden name="axis" class="axis" @slotchange=${(evt) => this._onSlotChanged(evt)}> </slot>
        `;
    }
    /**
     * Called after rendering (graph and lines generated here).
     *
     * @returns void
     */
    updated() {
        console.log('axis-def updated');
        if (!this.rendered && this.items.length > 0) {
            this.rendered = true;
            this.svgContainer = d3
                .select(this.shadowRoot)
                .select('#canvas')
                .append('svg');
            this.svgContainer
                .attr('width', this.graphSize)
                .attr('height', this.graphSize)
                .append('g');
            this.items.forEach((axis) => {
                this.addAxis(axis);
            });
            this.value = this.svgContainer;
        }
    }
}
__decorate([
    property({ type: Array }),
    __metadata("design:type", Number)
], AxisDef.prototype, "axisSize", void 0);
customElements.define('axis-def', AxisDef);
//# sourceMappingURL=axis-def.js.map