import { expect, tagName } from './constants.spec';
import { MultipleChoice } from '../components/multiple-choice';
import { FeedbackMessage, ResponseValidation } from '@hmh/component-base/dist/components/response-validation';

export default () => {
    describe(`<${tagName}> feedback in single mode`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('single-feedback-1');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('3').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('negative');
        });

        it('should provide positive feedback on correct answer', async (): Promise<void> => {
            withSnippet('single-feedback-1');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('2').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('positive');
            expect(feedback.score).to.equal(5);
        });
        it('should provide neutral feedback on correct answer', async (): Promise<void> => {
            withSnippet('single-feedback-1');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('4').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('neutral');
            expect(feedback.score).to.equal(1);
        });
        it('showFeedback() test', async (): Promise<void> => {
            withSnippet('single-feedback-1');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('4').click();
            await element.renderComplete;

            element.showFeedback();
            await element.renderComplete;

            // @ts-ignore accessing private member
            expect(element.feedbackType).to.equal('neutral');
        });
    });
    describe(`<${tagName}> feedback in multiple mode`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('5').click();
            await element.renderComplete;
            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('negative');
        });
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('6').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('negative');
        });

        it('should provide positive feedback on correct answer strict', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('1').click();
            element.shadowRoot.getElementById('3').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('positive');
            expect(feedback.score).to.equal(10);
        });
        it('use of exactMatch strategy', async (): Promise<void> => {
            withSnippet('multiple-feedback-2');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('1').click();
            element.shadowRoot.getElementById('3').click();
            element.shadowRoot.getElementById('4').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('positive');
            expect(feedback.score).to.equal(10);
        });
        it('use of fuzzyMatch strategy', async (): Promise<void> => {
            withSnippet('multiple-feedback-2');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('1').click();
            element.shadowRoot.getElementById('4').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('neutral');
            expect(feedback.score).to.equal(5);
        });
        it('default strategy test', async (): Promise<void> => {
            withSnippet('multiple-feedback-2');
            const element: MultipleChoice = document.querySelector('multiple-choice') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('2').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('positive');
            expect(feedback.score).to.equal(1);
        });
    });
};
