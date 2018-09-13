import { applyMixins, ComponentBase, html, TemplateResult, Feedback, MultipleChoiceMixin, repeat, unsafeHTML } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<drop-down>`
 * A drop down menu that supports embedded HTML within its option elements.
 * Currently uses Set for value so option values must be unique.
 * @demo ./demo/index.html
 */
export class DropDown extends ComponentBase<Set<string>> implements MultipleChoiceMixin, Feedback{
    /**
     * open - is the drop down open.
     * multiple = is this muli select?
     * feedbackMessage
     * 
     * @returns string
     */                      
    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.properties,
            open: Boolean,
            multiple: Boolean,
            feedbackMessage: Object,
            items: Array,
            value: Object,
        };
    }

    private defaultTitle = 'Select an option';
    public open: boolean = false;
    public multiple: boolean = false;
    public feedbackMessage: FeedbackMessage;
    items: HTMLElement[] = [];
    value: Set<string> = new Set();
    
    // declare mixins properties to satisfy the typescript compiler
    _getFeedback: (value: Set<string>) => FeedbackMessage;
    _onFeedbackSlotChanged:(evt: Event) => void;
    _onSlotChanged:(event: Event) => void;
    match:(el: ResponseValidation, response: Set<string>) => boolean;
    _responseValidationElements: ResponseValidation[];
    
    /**
     * Sets feedbackMessage (used in render for feedback state) depending upon this.value
     */
    getFeedback(): FeedbackMessage {
        return this._getFeedback(this.getValue());
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
     * @param {string} selectedValue
     * @returns void
     */
    
    _onItemClicked(event: Event, selectedValue: string): void {
        event.stopPropagation();

        if (this.value.has(selectedValue)) {
            this.value.delete(selectedValue);
        } else {
            this._selectElement(selectedValue);
        }
        // Set add doesn't result in a render call (no assignent)
        this.requestRender();

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

    /**
     * Select an options element. Behavior depends upon this.multiple
     * 
     * @param  {string} selectedValue
     * @returns void
     */
    private _selectElement(selectedValue: string) : void {        
        if (this.multiple) {
            this.value.add(selectedValue);
        } else {
            this.value = new Set<string>([selectedValue]);
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
    }

    /**
     * The template to render.
     * 
     * @param  {Boolean} {open - is the drop down open or not
     * @param  {FeedbackMessage} {feedbackMessage - message and feedback type (can be null)
     * @param  {Array of HTMLElement} items} - the option items
     * @param  {Array of String} value} - the value of this element (currently selected item(s))
     * 
     * @returns TemplateResult
     */
    protected _render({ open, feedbackMessage, items, value}: DropDown): TemplateResult {
        console.log('render value:', value);
 
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        
        <div class$="container ${this._getFeedbackClass(feedbackMessage, false)}">
            <div class="dropdown">
                <div class="buttons-container">
                    <button class="drop-button" on-click="${(evt: Event) => this._onDropDownClicked()}"> ${value.size > 0 ? [...value].pop() : this.defaultTitle}</button>
                    <button class="nav-button" on-click="${(evt: Event) => this._onDropDownClicked()}">${ open ? html`&uarr;` : html`&darr;` }</button>
                </div>
            </div>
                
            <div class="dropdown-content" hidden="${!open}">
                ${repeat(items, (item: HTMLElement) => item.id, (item: HTMLElement, index: number) => html`
                    <div class="options">
                        <div class$="option-item ${value.has(item.id) ? 'selected' : ''}" aria-selected$="${value.has(item.id)}" tabindex$="${index+1}" role="button" on-click="${(evt: MouseEvent) => this._onItemClicked(evt, item.id)}"> 
                            ${unsafeHTML(item.innerHTML)}
                        </div>
                    </div>
                `)}
            </div>
            
            <span class$="feedback-message ${this._getFeedbackClass(feedbackMessage, true)}">${ feedbackMessage ? feedbackMessage.message : ''}</span>
        
        </div>
        
        <slot name="options" class="options" on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}" hidden> </slot>
        <slot name="feedback" class="feedback-values" on-slotchange="${(evt: Event) => this._onFeedbackSlotChanged(evt)}"></slot>`;
    }

    /**
     * Get feedback classes for UI depending upon feedbackMessage.type
     * 
     * @param  {FeedbackMessage} feedbackMessage
     * @returns String
     */
    private  _getFeedbackClass(feedbackMessage: FeedbackMessage, isContainer: boolean): string {
        let result = '';
        
        const feedbackBackgroundMap = {
            positive: 'feedback-positive-background',
            negative: 'feedback-negative-background',
            neutral: 'feedback-neutral-background',
        };

        const feedbackBorderMap = {
            positive: 'feedback-positive-border',
            negative: 'feedback-negative-border',
            neutral: 'feedback-neutral-border',
        };

        if (feedbackMessage) {
            if (isContainer) {
                result = feedbackBackgroundMap[feedbackMessage.type];
            } else {
                result = feedbackBorderMap[feedbackMessage.type];
            }
        }
        
        return result;
    }
}

applyMixins(DropDown, [MultipleChoiceMixin, Feedback]);

customElements.define('drop-down', DropDown);
