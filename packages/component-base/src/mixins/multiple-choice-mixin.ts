import { Strategy } from '../index';
import { ResponseValidation, FeedbackMessage } from '../components/response-validation';

export abstract class MultipleChoiceMixin {
    public _responseValidationElements: ResponseValidation[];
    public items: HTMLElement[] = [];
    public feedbackMessage: FeedbackMessage;
    public feedbackType: string;

    public abstract getValue(): any;
    abstract getFeedback(): FeedbackMessage;
    /**
     * Fired on slot change
     * @param {Event} event
     */
    _onSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach(
                    (el: HTMLElement, index: number): void => {
                        el.setAttribute('index', String(index));
                        el.setAttribute('tabindex', String(index + 1));
                        el.setAttribute('role', 'button');
                        items.push(el);
                    }
                );
            }
        }
        this.items = items;
    }

    match: (el: ResponseValidation, response: Set<string>) => boolean = (el, response) => {
        if (!el.getExpected()) {
            // catch-all clause
            return true;
        }
        let matches: boolean = false;
        switch (el.strategy) {
            case Strategy.EXACT_MATCH:
                matches = response.size === el.getExpected().size;
                response.forEach((r: any) => {
                    matches = matches && el.getExpected().has(r);
                });
                return matches;
            case Strategy.FUZZY_MATCH:
                response.forEach((r: any) => {
                    matches = matches || el.getExpected().has(r);
                });
                return matches;
            default:
                return matches;
        }
    };

    showFeedback(): void {
        this.feedbackType = this.getFeedback().type;
    }

    abstract _onItemClicked(event: Event, id: string, type?: string): any;
}
