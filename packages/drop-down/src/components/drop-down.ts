import { FeedbackMessage, html, Mode, property, TemplateResult, MultipleChoice, repeat, unsafeHTML } from '@hmh/component-base/dist/index';

/**
 * `<drop-down>`
 * A drop down menu that supports embedded HTML within its option elements.
 * Currently uses Set for value so option values must be unique.
 * @demo ./demo/index.html
 */
export class DropDown extends MultipleChoice {
    @property({ type: Boolean })
    public disabled: boolean = false;
    @property({ type: String })
    public feedbackMessage: FeedbackMessage;
    @property({ type: String })
    public mode: Mode = Mode.INTERACTIVE;
    @property({ type: Array })
    public value: string[];
    @property({ type: Array })
    public items: HTMLElement[] = [];
    @property({ reflect: true, type: Boolean })
    public open: boolean = false;
    @property({ reflect: true, type: Boolean })
    public multiple: boolean = false;

    private defaultTitle = 'Select an option';

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
     * Sets various accessibility attributes.
     *
     * @returns void
     */
    private _enableAccessibility(): void {
        this.setAttribute('role', 'popupbutton');
        this.setAttribute('aria-haspopup', 'true');
        this.setAttribute('aria-label', this.shadowRoot.querySelector('.drop-button').innerHTML);
    }

    /**
     * Called after each render (render called per relevant state change).
     *
     * @returns void
     */
    protected updated(): void {
        this._enableAccessibility();
    }

    /**
     * The template to render.
     *
     * @param  {Boolean} open - is the drop down open or not
     * @param  {FeedbackMessage} feedbackMessage - message and feedback type (can be null)
     * @param  {Array of HTMLElement} items - the option items
     * @param  {Array of String} value - the value of this element (currently selected item(s))
     *
     * @returns TemplateResult
     */
    protected render(): TemplateResult {
        const { open, feedbackMessage, items, multiple, value }: DropDown = this;

        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        
        <div class="container ${this._getFeedbackClass(feedbackMessage, false)}">
            <div class="dropdown">
                <div class="buttons-container">
                    <button class="drop-button" @click=${(evt: Event) => this._onDropDownClicked()}>
                        ${value.length > 0 ? [...value].join(',') : this.defaultTitle}
                    </button>
                    <button class="nav-button" @click=${(evt: Event) => this._onDropDownClicked()}>
                        ${open ? html`&uarr;` : html`&darr;`}
                    </button>
                </div>
            </div>
                
            <div class="dropdown-content" ?hidden=${!open}>
                ${repeat(
                    items,
                    (item: HTMLElement) => item.id,
                    (item: HTMLElement, index: number) => {
                        return html`
                    <div class="options">
                        <div class="option-item ${value.includes(item.id) ? 'selected' : ''}" 
                            aria-selected=${value.includes(item.id) ? 'true' : 'false'}
                            id=${item.id}
                            tabindex=${index + 1}
                            role="button"
                            @click=${(evt: MouseEvent) => this._onItemClicked(evt, item.id, multiple)}> 
                            ${unsafeHTML(item.innerHTML)}
                        </div>
                    </div>
                `;
                    }
                )}
            </div>
            
            <span class="feedback-message ${this._getFeedbackClass(feedbackMessage, true)}">${feedbackMessage ? feedbackMessage.message : ''}</span>
        
        </div>
        
        <slot hidden name="options" class="options" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}></slot>
        <slot name="feedback" class="feedback-values" @slotchange=${(evt: Event) => this._onFeedbackSlotChanged(evt)}></slot>`;
    }

    /**
     * Get feedback classes for UI depending upon feedbackMessage.type
     *
     * @param  {FeedbackMessage} feedbackMessage
     * @returns String
     */
    private _getFeedbackClass(feedbackMessage: FeedbackMessage, isContainer: boolean): string {
        if (!feedbackMessage) {
            return '';
        }

        return isContainer ? `feedback-${feedbackMessage.type}-background` : `feedback-${feedbackMessage.type}-border`;
    }
}

customElements.define('drop-down', DropDown);
