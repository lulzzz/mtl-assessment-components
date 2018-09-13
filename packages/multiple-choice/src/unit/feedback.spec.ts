import { expect, mcqTagName } from './constants.spec';
import { MultipleChoiceQuestion } from '../components/multiple-choice-question';
import { MultipleResponseQuestion } from '../components/multiple-response-question';
import { FeedbackMessage } from '@hmh/component-base/dist/components/response-validation';

export default () => {
    describe(`<${mcqTagName}> feedback in single mode`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('single-feedback-1');
            const element: MultipleChoiceQuestion = document.querySelector('multiple-choice-question') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('3').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('negative');
        });

        it('should provide positive feedback on correct answer', async (): Promise<void> => {
            withSnippet('single-feedback-1');
            const element: MultipleChoiceQuestion = document.querySelector('multiple-choice-question') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('2').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('positive');
            expect(feedback.score).to.equal(5);
        });
        it('should provide neutral feedback on correct answer', async (): Promise<void> => {
            withSnippet('single-feedback-1');
            const element: MultipleChoiceQuestion = document.querySelector('multiple-choice-question') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('4').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('neutral');
            expect(feedback.score).to.equal(1);
        });
        it('should show feedback', async (): Promise<void> => {
            withSnippet('single-feedback-1');
            const element: MultipleChoiceQuestion = document.querySelector('multiple-choice-question') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('4').click();
            await element.renderComplete;

            element.showFeedback();
            await element.renderComplete;

            // @ts-ignore accessing private member
            expect(element.feedbackType).to.equal('neutral');
        });
    });
    describe(`<${mcqTagName}> feedback in multiple mode`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleResponseQuestion = document.querySelector('multiple-choice-question') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('5').click();
            await element.renderComplete;
            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('negative');
        });
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleResponseQuestion = document.querySelector('multiple-response-question') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('6').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('negative');
        });

        it('should provide positive feedback on correct answer strict', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleResponseQuestion = document.querySelector('multiple-response-question') as any;
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
            const element: MultipleResponseQuestion = document.querySelector('multiple-response-question') as any;
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
            const element: MultipleResponseQuestion = document.querySelector('multiple-response-question') as any;
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
            const element: MultipleResponseQuestion = document.querySelector('multiple-response-question') as any;
            await element.renderComplete;
            element.shadowRoot.getElementById('2').click();
            await element.renderComplete;

            const feedback: FeedbackMessage = element.getFeedback();
            expect(feedback.type).to.equal('negative');
        });
    });
};
