import { ResponseValidation } from './response-validation.js';
import { ComponentBase, html, property, TemplateResult } from './base.js';
import { Feedback, FeedbackMessage, Strategy } from '../mixins/feedback.js';
import { applyMixins } from '../util.js';

export abstract class MultipleChoice extends ComponentBase<string[]> implements Feedback {
    @property({ type: Array })
    public value: string[] = [];
    @property({ type: Object })
    public feedbackMessage: FeedbackMessage;
    @property({ type: Array })
    protected items: HTMLElement[] = [];

    protected readonly styles: TemplateResult = html`<style>
        main {
        display: flex;
        flex-direction: var(--align-options, column);
        flex-flow: var(--align-options, column) wrap;
        justify-content: var(--justify-content, flex-start);
        }

        .positive {
        outline: 2px solid var(--positive-color, green);
        }

        .negative {
        outline: 2px solid var(--negative-color, red);
        }

        .neutral {
        outline: 2px solid var(--neutral-color, yellow);
        }

        .mdc-form-field {
        flex-basis: var(--option-width, content);
        }
        </style>`;

    // @mixin: Feedback
    computeFeedback: (value: string[]) => FeedbackMessage;
    _onFeedbackSlotChanged: (evt: Event) => void;



    /**
     * @param  {ResponseValidation} el - the element containing an expected value and a strategy
     * @param  {any} response - The value to match against
     */
    public match(el: ResponseValidation, response: string[]): boolean {
        if (!el.expected) {
            // catch-all clause
            return true;
        }
        const expected: string[] = el.expected.split('|');

        switch (el.strategy) {
            case Strategy.ANY:
                return expected.some((answer: string) => response.includes(answer));
            case Strategy.CONTAINS:
                return expected.every((answer: string) => response.includes(answer));
            case Strategy.EXACT_MATCH:
            default:
                return response.length === expected.length && expected.every((answer: string) => response.includes(answer));
        }
    }

    /**
     * Called when an option item is selected.
     * Sets the element value to that of the selected element.
     *
     * @param  {HTMLElement} eventTarget
     * @param {string} selected
     * @param {boolean} multiple
     * @returns void
     */
    protected _onItemClicked(event: Event, selected: string, multiple: boolean = false): void {
        event.stopPropagation();

        let value: string[] = [...this.value];
        const index: number = value.indexOf(selected);

        if (index >= 0) {
            // remove element from the array
            value.splice(index, 1);
        } else {
            multiple ? value.push(selected) : (value = [selected]);
        }

        this.value = value;

        (this as any).dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: { value }
            })
        );
    }

    /**
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement, index: number): void => {
                    /* istanbul ignore if */
                    if (!(el instanceof HTMLSpanElement)) {
                        console.warn('It is recommendeded to use <span> for options:', el);
                    }
                    el.setAttribute('index', String(index));
                    el.setAttribute('tabindex', String(index + 1));
                    el.setAttribute('role', 'button');
                    items.push(el);
                }
            );
        }
        this.items = items;
    }
}

applyMixins(MultipleChoice, [Feedback]);
