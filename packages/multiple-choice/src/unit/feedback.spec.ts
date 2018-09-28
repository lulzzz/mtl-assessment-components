import { expect, mcqTagName, mrqTagName } from './constants.spec';
import { MultipleChoiceQuestion } from '../components/multiple-choice-question';
import { MultipleResponseQuestion } from '../components/multiple-response-question';

export default () => {
    describe(`<${mcqTagName}> feedback in single mode`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('single-feedback');
            const element: MultipleChoiceQuestion = document.querySelector(mcqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('3').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('negative');
        });

        it('should provide positive feedback on correct answer', async (): Promise<void> => {
            withSnippet('single-feedback');
            const element: MultipleChoiceQuestion = document.querySelector(mcqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('2').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('positive');
            expect(element.feedbackMessage.score).to.equal(5);
        });
        it('should provide neutral feedback on neutral answer', async (): Promise<void> => {
            withSnippet('single-feedback');
            const element: MultipleChoiceQuestion = document.querySelector(mcqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('4').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('neutral');
            expect(element.feedbackMessage.score).to.equal(1);
        });
        it('should show feedback', async (): Promise<void> => {
            withSnippet('single-feedback');
            const element: MultipleChoiceQuestion = document.querySelector(mcqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('4').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('neutral');
        });
    });
    describe(`<${mrqTagName}> feedback in multiple mode`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleResponseQuestion = document.querySelector(mrqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('5').click();
            await element.updateComplete;
            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('negative');
        });
        it('should provide positive feedback on correct answer strict', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleResponseQuestion = document.querySelector(mrqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('1').click();
            element.shadowRoot.getElementById('3').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('positive');
            expect(element.feedbackMessage.score).to.equal(10);
        });
        it('should provide neutral feedback on neutral answer', async (): Promise<void> => {
            withSnippet('multiple-feedback-1');
            const element: MultipleResponseQuestion = document.querySelector(mrqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('1').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('neutral');
        });
        it('use of exactMatch strategy', async (): Promise<void> => {
            withSnippet('multiple-feedback-2');
            const element: MultipleResponseQuestion = document.querySelector(mrqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('1').click();
            element.shadowRoot.getElementById('3').click();
            element.shadowRoot.getElementById('4').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('positive');
            expect(element.feedbackMessage.score).to.equal(10);
        });
        it('use of contains any strategy', async (): Promise<void> => {
            withSnippet('multiple-feedback-2');
            const element: MultipleResponseQuestion = document.querySelector(mrqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('1').click();
            element.shadowRoot.getElementById('4').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('neutral');
            expect(element.feedbackMessage.score).to.equal(5);
        });
        it('default strategy test', async (): Promise<void> => {
            withSnippet('multiple-feedback-2');
            const element: MultipleResponseQuestion = document.querySelector(mrqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('2').click();
            await element.updateComplete;
            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('negative');
        });
        it('should show feedback', async (): Promise<void> => {
            withSnippet('multiple-feedback-2');
            const element: MultipleChoiceQuestion = document.querySelector(mrqTagName) as any;
            await element.updateComplete;
            element.shadowRoot.getElementById('4').click();
            await element.updateComplete;

            element.showFeedback();
            expect(element.feedbackMessage.type).to.equal('neutral');
        });
    });
};
