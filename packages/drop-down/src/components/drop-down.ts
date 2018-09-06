import { applyMixins, ComponentBase, html, TemplateResult, Feedback } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/response-validation/dist/components/response-validation';

/**
 * `<drop-down>`
 * A drop down menu that supports embedded HTML within its option elements.
 * @demo ./demo/index.html
 */
export class DropDown extends ComponentBase<string> implements Feedback {
    public feedbackMessage: FeedbackMessage;
    public values: string = '';
    public open: boolean = false;

    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: string) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];
    public _onFeedbackSlotChanged: any;
    public match: any;

    /**
     * value - is currently selected option value.
     * open - is the drop down open.
     * feedbackText
     * 
     * @returns string
     */
    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            feedbackMessage: Object,
            value: String,
            open: Boolean
        };
    }
    
    public getFeedback(): FeedbackMessage{
        return this._getFeedback(this.getValue());
    }

    public onFeedbackSlotChanged(evt: any) {
        return this._onFeedbackSlotChanged(evt)
    }

    public showFeedback(): void {
        this.feedbackMessage = this.getFeedback();
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
            this.shadowRoot.querySelector('.drop-button').innerHTML = eventTarget.innerHTML;
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
        this.setAttribute('aria-label', this.shadowRoot.querySelector('.drop-button').innerHTML);
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
    protected _render({ open, value, feedbackMessage }: DropDown): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        
        <div class$="container ${this._getContainerClass(feedbackMessage)}">
            <div class="dropdown" value="${value}">
                <div class="buttons-container">
                    <button class="drop-button" on-click="${(evt: Event) => this._onDropDownClicked()}">Dropdown</button>
                    <button class="nav-button" on-click="${(evt: Event) => this._onDropDownClicked()}">${ open ? html`&uarr;` : html`&darr;` }</button>
                </div>
                <div class="dropdown-content" hidden="${!open}">
                    <slot name="options" class="options" 
                    on-click="${(evt: MouseEvent) => this._onItemClicked(evt.target as HTMLElement)}"
                    on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}"> </slot>
                </div>
            </div>

            <span class$="feedback-message ${this._getFeedbackClass(feedbackMessage)}">${ feedbackMessage ? feedbackMessage.message : ''}</span>

        </div>
        <slot name="feedback" class="feedback-values" on-slotchange="${(evt: Event) => this._onFeedbackSlotChanged(evt)}"></slot>`;
    }

    private _getContainerClass(feedbackMessage: FeedbackMessage) : String {
        let result = '';

        if (feedbackMessage) {
            result = feedbackMessage.type === 'positive' ? 'feedback-positive-border' : feedbackMessage.type === 'negative' ? 'feedback-negative-border'      
                : 'feedback-neutral-border';
        }

        return result;
    }

    private _getFeedbackClass(feedbackMessage: FeedbackMessage) : String {
        let result = '';

        if (feedbackMessage) {
            result = feedbackMessage.type === 'positive' ? 'feedback-positive-background' : feedbackMessage.type === 'negative' ? 'feedback-negative-background'      
                : 'feedback-neutral-background';
        }

        return result;
    }
}

applyMixins(DropDown, [Feedback]);

customElements.define('drop-down', DropDown);
