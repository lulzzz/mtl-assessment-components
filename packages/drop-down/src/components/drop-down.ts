import { applyMixins, ComponentBase, html, TemplateResult, Feedback, MultipleChoiceMixin } from '@hmh/component-base/dist/index';
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
            ...super.properties,
            open: Boolean,
            multiple: Boolean,
            feedbackMessage: Object
        };
    }

    private currentOptionIndex: number = -1;
    public value: Set<string> = new Set;
    public open: boolean = false;
    public multiple: boolean = false;
    private defaultTitle = 'Select an option';
    public feedbackMessage: FeedbackMessage;
    
    // declare mixins properties to satisfy the typescript compiler
    public getFeedback:() => FeedbackMessage;
    public showFeedback:() => void;
    _getFeedback: (value: Set<string>) => FeedbackMessage;
    _onFeedbackSlotChanged:(evt: Event) => void;
    _onSlotChanged:(event: Event) => void;
    match:(el: ResponseValidation, response: Set<string>) => boolean;
    items: HTMLElement[] = [];
    _responseValidationElements: ResponseValidation[];

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
    _onItemClicked(event: Event, id: string): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.hasAttribute('slot')) {
            const selectedValue = id;

            if (this.multiple) {
                if (this.value.has(selectedValue)) {
                    // deselect if clicking on an already selected item
                    this._deselectElement(selectedValue, eventTarget);
                } else {
                    this._selectElement(selectedValue, eventTarget);
                }
            } else {
                // deslect whatever was perviously selected
                if (this.currentOptionIndex > -1) {
                    this._deselectElement([...this.getValue()].pop(), this._getOptionElement(this.currentOptionIndex));
                } 

                // deselect (or don't re-select if clicking on already selected item )
                if (this.currentOptionIndex != Number(eventTarget.getAttribute('index'))) {
                    this._selectElement(selectedValue, eventTarget);
                }
            }

            const strValue = [...this.value].toString();
            this.shadowRoot.querySelector('.drop-button').innerHTML = strValue ? strValue : this.defaultTitle;

            this.dispatchEvent(
                new CustomEvent('change', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        value: [...this.value]
                    }
                })
            );
        }
    }

    /**
     * Select an options element. Behavior depends upon this.multiple
     * 
     * @param  {string} selectedValue
     * @param  {HTMLElement} eventTarget
     * @returns void
     */
    private _selectElement(selectedValue: string, eventTarget: HTMLElement) : void {
        this._clearAriaSelections();
        
        if (!this.multiple) {
            this.value.clear();
        }

        eventTarget.classList.add('selected');
        eventTarget.setAttribute('aria-selected', 'true');
        this.value.add(selectedValue);
        this.currentOptionIndex = Number(eventTarget.getAttribute('index'));
    }

    /**
     * Unselect an options element. Behavior depends upon this.multiple
     * 
     * @param  {string} selectedValue
     * @param  {HTMLElement} eventTarget
     * @returns void
     */
    private _deselectElement(selectedValue: string, eventTarget: HTMLElement) : void {
        this.value.delete(selectedValue);
        eventTarget.classList.remove('selected');
        eventTarget.setAttribute('aria-selected', 'false');
    }

    private _getOptionElement(optionIndex: number) : HTMLElement {
        const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;
        return slot.assignedNodes()[optionIndex] as HTMLElement;
    }

    /**
     * Set all the option items 'aria-selected' attributes to false.
     * 
     * @returns void
     */
    private _clearAriaSelections(): void {
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
        this.setAttribute('value', [...this.value].toString());
    }
    
    /**
     * The template to render.
     * 
     * @param  {} {open - is the drop down open or not
     * @param  {DropDown} value} - the value of the element (value of the currently selected option(s))
     * @returns TemplateResult
     */
    protected _render({ open, value, multiple, feedbackMessage }: DropDown): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        
        <div class$="container ${this._getContainerClass(feedbackMessage)}">
            <div class="dropdown" value="${value}">
                <div class="buttons-container">
                    <button class="drop-button" on-click="${(evt: Event) => this._onDropDownClicked()}">${this.defaultTitle}</button>
                    <button class="nav-button" on-click="${(evt: Event) => this._onDropDownClicked()}">${ open ? html`&uarr;` : html`&darr;` }</button>
                </div>
                <div class="dropdown-content" hidden="${!open}">
                    <slot name="options" class="options" 
                    on-click="${(evt: MouseEvent) => this._onItemClicked(evt, (evt.target as HTMLElement).getAttribute('value'))}"
                    on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}"> </slot>
                </div>
            </div>

            <span class$="feedback-message ${this._getFeedbackClass(feedbackMessage)}">${ feedbackMessage ? feedbackMessage.message : ''}</span>

        </div>
        <slot name="feedback" class="feedback-values" on-slotchange="${(evt: Event) => this._onFeedbackSlotChanged(evt)}"></slot>`;
    }

    /**
     * Get container class for UI depending upon feedbackMessage.type
     * 
     * @param  {FeedbackMessage} feedbackMessage
     * @returns String
     */
    private _getContainerClass(feedbackMessage: FeedbackMessage) : String {
        let result = '';

        if (feedbackMessage) {
            result = feedbackMessage.type === 'positive' ? 'feedback-positive-border' : feedbackMessage.type === 'negative' ? 'feedback-negative-border'      
                : 'feedback-neutral-border';
        }

        return result;
    }

    /**
     * Get feedback class for UI depending upon feedbackMessage.type
     * 
     * @param  {FeedbackMessage} feedbackMessage
     * @returns String
     */
    private _getFeedbackClass(feedbackMessage: FeedbackMessage) : String {
        let result = '';

        if (feedbackMessage) {
            result = feedbackMessage.type === 'positive' ? 'feedback-positive-background' : feedbackMessage.type === 'negative' ? 'feedback-negative-background'      
                : 'feedback-neutral-background';
        }

        return result;
    }
}

applyMixins(DropDown, [MultipleChoiceMixin, Feedback]);

customElements.define('drop-down', DropDown);
