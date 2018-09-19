import { BaseElementFeedback } from './fixture-elements';
import { FeedbackMessage } from '../mixins/feedback';

const expect: any = chai.expect;

export default function() {
    describe('Feedback Mixin', (): void => {
        it('should mix in feedback methods', async (): Promise<void> => {
            withSnippet('base-with-feedback-empty-slot');
            const el: BaseElementFeedback = document.querySelector('base-element-feedback') as any;
            await el.renderComplete;

            expect(typeof el.computeFeedback).to.equal('function');
            expect(typeof el._onFeedbackSlotChanged).to.equal('function');
            expect(el._responseValidationElements.length).to.equal(0);
        });

        it('should throw an error when trying to compute feedback without any validation element defined', async (): Promise<void> => {
            withSnippet('base-with-feedback-empty-slot');
            const el: BaseElementFeedback = document.querySelector('base-element-feedback') as any;
            await el.renderComplete;
            console.log('el.match', el.match);
            expect(() => el.computeFeedback('hello')).to.throw(Error, 'missing default response-validation');
        });

        it('should handle response-validation children', async (): Promise<void> => {
            withSnippet('base-with-feedback');
            const el: BaseElementFeedback = document.querySelector('base-element-feedback') as any;
            await el.renderComplete;

            expect(el._responseValidationElements.length).to.equal(3);
        });

        it('should correctly compute feedback on right answer', async (): Promise<void> => {
            withSnippet('base-with-feedback');
            const el: BaseElementFeedback = document.querySelector('base-element-feedback') as any;
            await el.renderComplete;
            const msg: FeedbackMessage = el.computeFeedback('hello');
            expect(msg.type).to.equal('positive');
            expect(msg.message).to.equal('A');
        });

        it('should correctly compute feedback on neutral answer', async (): Promise<void> => {
            withSnippet('base-with-feedback');
            const el: BaseElementFeedback = document.querySelector('base-element-feedback') as any;
            await el.renderComplete;
            const msg: FeedbackMessage = el.computeFeedback('world');
            expect(msg.type).to.equal('neutral');
            expect(msg.message).to.equal('B');
        });

        it('should correctly compute feedback on neutral answer', async (): Promise<void> => {
            withSnippet('base-with-feedback');
            const el: BaseElementFeedback = document.querySelector('base-element-feedback') as any;
            await el.renderComplete;
            let msg: FeedbackMessage = el.computeFeedback('xxx');
            expect(msg.type).to.equal('negative');
            expect(msg.message).to.equal('C');
            msg = el.computeFeedback('yyy');
            expect(msg.type).to.equal('negative');
            expect(msg.message).to.equal('D');
            msg = el.computeFeedback('zzz');
            expect(msg.type).to.equal('negative');
            expect(msg.message).to.equal('E');
            msg = el.computeFeedback('aaa');
            msg = el.computeFeedback('hello');
            expect(msg.type).to.equal('positive');
            expect(msg.message).to.equal('A');
        });

        it('should not throw if feedback slot is not defined', async (): Promise<void> => {
            withSnippet('base-with-feedback-without-slot');
            const el: BaseElementFeedback = document.querySelector('base-element-feedback-no-slot') as any;
            await el.renderComplete;
            expect(() => el._onFeedbackSlotChanged(new Event('slotchange'))).not.to.throw();
        });
    });
}
