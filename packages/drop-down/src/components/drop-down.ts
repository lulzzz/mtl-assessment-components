import { FeedbackMessage, html, Mode, property, TemplateResult, MultipleChoice, repeat, unsafeHTML } from '@hmh/component-base';

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

    protected readonly styles: TemplateResult = html`
    <style>
        .body {
            font-family: var(--font-family,Roboto);
        }

        ::slotted {
            font-family: var(--font-family,Roboto);
        }

        /* Dropdown Button */
        .drop-button {
            background-color: #fff;
            color: #000;
            font-size: 16px;
            cursor: pointer;
            border-color: #000;
            width: 100%;
        }

        /* Dropdown button on hover & focus */
        .drop-button:hover, .drop-button:focus {
            background-color: #fff;
            border-color: #000;
        }

        /* The container <div> - needed to position the dropdown content */
        .dropdown {
            position: relative;
            display: inline-block;
            width: 160px;
        }

        /* Dropdown Content (Hidden by Default) */
        .dropdown-content {
            position: absolute;
            background-color: #f1f1f1;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
            margin-top: 24px;
        }

        /* Links inside the dropdown */
        .dropdown-content a {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
        }

        .buttons-container {
            display: flex;
            flex-direction: row;    
        }

        .nav-buttons-container {
            display: flex;
            flex-direction: column;
            float: right;
        }

        .option-item {
            border-style: solid;
            border-color: transparent
        }

        .option-item:hover {
            border-style: solid;
            border-color: var(--option-hover-color, #BEE9F7);
        }

        .selected {
            background-color: var(--option-selected-color,lightblue);
        }

        .feedback-values {
            display: none;
        }

        .container {
            display: inline-flex;
            border-style: solid;
            border-color: transparent;
        }

        .feedback-negative-border {
            border-color: var(--feedback-negative-color,red);
        }

        .feedback-positive-border {
            border-color: var(--feedback-positive-color,green);
        }

        .feedback-neutral-border {
            border-color: var(--feedback-neutral-color,yellow);
        }

        .feedback-message {
            justify-content: center;
            align-items: center;
            padding-left: 5px;
            padding-right: 5px;
            display: flex;
        }

        .feedback-negative-background {
            background-color: var(--feedback-negative-color,red);
        }

        .feedback-positive-background {
            background-color: var(--feedback-positive-color,green);
            justify-content: center;
            align-items: center;
        }

        .feedback-neutral-background {
            background-color: var(--feedback-neutral-color,yellow);
            justify-content: center;
            align-items: center;
        }
    </style>
    `;

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
        const { open, feedbackMessage, items, multiple, styles, value }: DropDown = this;

        return html`
        <link rel="stylesheet" href="/css/drop-down.css">
        ${styles}
        
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

            <span class="feedback-message ${this._getFeedbackClass(feedbackMessage, true)}">${feedbackMessage ? unsafeHTML(feedbackMessage.message) : ''}</span>

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
