import { ComponentBase, html, property, TemplateResult } from '@hmh/component-base';

const DEFAULT_DELAY: number = 2000;
const DEFAULT_STAGE_WIDTH: string = '640px';
/**
 * `<image-gallery>`
 * @demo ./demo/index.html
 */
export class ImageGallery extends ComponentBase<number> {
    @property({ type: Boolean })
    public autoPlay: boolean = false;
    @property({ type: String, attribute: 'activity-title' })
    public activityTitle: string = 'Hello World';
    @property({ type: Number })
    public position: number = 0;
    @property({ type: Number })
    private count: number = 0;
    private interval: NodeJS.Timer;

    public get stageWidth(): string {
        return getComputedStyle(this as any).getPropertyValue('--stage-width') || DEFAULT_STAGE_WIDTH;
    }

    public get styles(): TemplateResult {
        return html`.carousel { margin-left: ${-this.position * parseInt(this.stageWidth)}px; }`;
    }
    get value(): number {
        return this.position;
    }

    /**
     * Play the slideshow, switching automatically after the specified delay
     *
     * @param delay : time to wait before switching to the next slide
     * @param reverse : reverse playback direction
     */
    public play(delay: number = DEFAULT_DELAY, reverse: boolean = false): void {
        this.pause();
        this.interval = setInterval(() => (reverse ? this.prev() : this.next()), delay);
    }

    public pause(): void {
        clearInterval(this.interval);
    }

    public next(): ImageGallery {
        this.position = (this.position + 1) % this.count;
        return this;
    }

    public prev(): ImageGallery {
        this.position = (this.count + (this.position - 1)) % this.count;
        return this;
    }

    public goto(position: number = 0): void {
        if (Math.abs(position) > this.count) {
            position = 0;
        }

        if (position >= 0) {
            this.position = position % this.count;
        } else {
            this.position = (this.count + position) % this.count;
        }
    }

    firstUpdated(): void {
        if (this.autoPlay) {
            this.play();
        }

        const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
        for (const el of nodes as HTMLElement[]) {
            el.removeAttribute('hidden');
        }
    }

    render(): TemplateResult {
        const style: TemplateResult = html`<style>${this.styles}</style>`;

        return html`
            <link rel="stylesheet" type="text/css" href="/css/image-gallery.css">
            <link rel="stylesheet" type="text/css" href="@material/button/dist/mdc.button.css">
            ${style}
            <main>
                <h3>${this.activityTitle}</h3>
                <section class="stage">
                    <div class="carousel">
                        <slot name="items" @slotchange="${(e: Event) => this.slotChanged(e)}"></slot>
                    </div>
                </section>
                <nav>
                    <button class="mdc-button"  ?disabled="${this.position <= 0}" @click="${() => this.prev()}" >previous</button>
                    <span>${this.position + 1} of ${this.count}</span>
                    <button class="mdc-button" @click="${() => this.next()}" ?disabled="${this.position >= this.count - 1}">next</button>
                </nav>
            </main>
            `;
    }

    /**
     * Update the UI whenever nodes are added or removed from the slot
     *
     * @param event
     */
    private slotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                this.count = nodes.length;
                for (const el of nodes as HTMLElement[]) {
                    const img: HTMLImageElement = el.querySelector('img');
                    if (img) {
                        el.querySelector('img').style.height = 'inherit';
                    }
                }
            }
        }
    }
}

customElements.define('image-gallery', ImageGallery);
