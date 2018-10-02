import { ResponseValidation } from '../components/response-validation';
import { FeedbackMessage, FeedbackType } from '../mixins/feedback';

const expect: any = chai.expect;

export default function() {
    describe('Response Validation Element', (): void => {
        it('should render properly', async (): Promise<void> => {
            withSnippet('response-validation');
            const el: ResponseValidation = document.querySelector('response-validation') as any;
            await el.updateComplete;

            const slot: HTMLSlotElement = el.shadowRoot.querySelector('slot');
            expect(slot).not.to.be.undefined;
            expect(slot instanceof Element).to.be.true;

            expect(typeof el.getFeedback).to.equal('function');
            expect(typeof el.reset).to.equal('function');
            // @ts-ignore : private function
            expect(typeof el._onSlotChanged).to.equal('function');
            expect(el._responseValidationElements.length).to.equal(0);
        });

        it('should display message according to user attempts', async (): Promise<void> => {
            withSnippet('response-validation-messages');
            const el: ResponseValidation = document.querySelector('response-validation') as any;
            await el.updateComplete;

            let msg: FeedbackMessage = el.getFeedback();
            expect(msg.message).to.equal('X');
            msg = el.getFeedback();
            expect(msg.message).to.equal('Y');
            msg = el.getFeedback();
            expect(msg.message).to.equal('Z');
            msg = el.getFeedback();
            expect(msg.message).to.equal('Z');
        });

        it('should allow to reset user attempts', async (): Promise<void> => {
            withSnippet('response-validation-messages');
            const el: ResponseValidation = document.querySelector('response-validation') as any;
            await el.updateComplete;

            let msg: FeedbackMessage = el.getFeedback();
            expect(msg.message).to.equal('X');
            msg = el.getFeedback();
            expect(msg.message).to.equal('Y');
            el.reset();
            msg = el.getFeedback();
            expect(msg.message).to.equal('X');
            msg = el.getFeedback();
            expect(msg.message).to.equal('Y');
        });

        it('should compute feedback type based on score when feedback type is not specified', async (): Promise<void> => {
            withSnippet('response-validation-messages');
            const el: ResponseValidation = document.querySelector('response-validation') as any;
            await el.updateComplete;

            let msg: FeedbackMessage = el.getFeedback();
            expect(msg.message).to.equal('X');
            expect(msg.score).to.equal(0);
            expect(msg.type).to.equal(FeedbackType.NEGATIVE);

            el.score = 5;
            await el.updateComplete;
            msg = el.getFeedback();
            expect(msg.message).to.equal('Y');
            expect(msg.score).to.equal(5);
            expect(msg.type).to.equal(FeedbackType.POSITIVE);

            el.score = -2;
            await el.updateComplete;
            msg = el.getFeedback();
            expect(msg.message).to.equal('Z');
            expect(msg.score).to.equal(-2);
            expect(msg.type).to.equal(FeedbackType.NEGATIVE);
        });

        it('should compute feedback type based on what specified regardless of the score', async (): Promise<void> => {
            withSnippet('response-validation-messages');
            const el: ResponseValidation = document.querySelector('response-validation') as any;
            await el.updateComplete;
            el.feedbackType = FeedbackType.POSITIVE;
            await el.updateComplete;

            let msg: FeedbackMessage = el.getFeedback();
            expect(msg.message).to.equal('X');
            expect(msg.score).to.equal(0);
            expect(msg.type).to.equal(FeedbackType.POSITIVE);

            el.score = 5;
            await el.updateComplete;
            msg = el.getFeedback();
            expect(msg.message).to.equal('Y');
            expect(msg.score).to.equal(5);
            expect(msg.type).to.equal(FeedbackType.POSITIVE);

            el.score = -2;
            await el.updateComplete;
            msg = el.getFeedback();
            expect(msg.message).to.equal('Z');
            expect(msg.score).to.equal(-2);
            expect(msg.type).to.equal(FeedbackType.POSITIVE);
        });

        it('should handle neutral feedback', async (): Promise<void> => {
            withSnippet('response-validation-messages');
            const el: ResponseValidation = document.querySelector('response-validation') as any;
            await el.updateComplete;
            el.feedbackType = FeedbackType.NEUTRAL;
            await el.updateComplete;

            let msg: FeedbackMessage = el.getFeedback();
            expect(msg.message).to.equal('X');
            expect(msg.score).to.equal(0);
            expect(msg.type).to.equal(FeedbackType.NEUTRAL);

            el.score = 5;
            await el.updateComplete;
            msg = el.getFeedback();
            expect(msg.message).to.equal('Y');
            expect(msg.score).to.equal(5);
            expect(msg.type).to.equal(FeedbackType.NEUTRAL);

            el.score = -2;
            await el.updateComplete;
            msg = el.getFeedback();
            expect(msg.message).to.equal('Z');
            expect(msg.score).to.equal(-2);
            expect(msg.type).to.equal(FeedbackType.NEUTRAL);
        });
    });
}
