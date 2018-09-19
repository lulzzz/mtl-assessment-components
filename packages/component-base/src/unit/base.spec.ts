import { BaseElement } from './fixture-elements';
import { fake } from 'sinon/pkg/sinon-esm';

const expect: any = chai.expect;

export default function() {
    describe('ComponentBase', (): void => {
        it('should render as expected', async (): Promise<void> => {
            withSnippet('base');
            const el: BaseElement = document.querySelector('base-element') as any;
            await el.renderComplete;
            const text: string = el.shadowRoot.querySelector('main').innerText;
            expect(text).to.equal('Hello BaseElement');
        });

        it('should not include feedback methods', async (): Promise<void> => {
            withSnippet('base');
            const el: BaseElement = document.querySelector('base-element') as any;
            await el.renderComplete;
            expect(el.computeFeedback).to.be.undefined;
            expect(el._onFeedbackSlotChanged).to.be.undefined;
        });

        it('should throw on showFeedback', async (): Promise<void> => {
            withSnippet('base');
            const el: BaseElement = document.querySelector('base-element') as any;
            await el.renderComplete;
            expect(() => el.showFeedback()).to.throw(Error, 'unsupported method');
        });

        it('should call computeFeedback function if defined', async (): Promise<void> => {
            withSnippet('base');
            const el: BaseElement = document.querySelector('base-element') as any;
            el.computeFeedback = fake();
            // sinon stub of computeFeedback
            await el.renderComplete;
            expect(() => el.showFeedback()).not.to.throw();
        });

        it('should return undefined on getFeedback', async (): Promise<void> => {
            withSnippet('base');
            const el: BaseElement = document.querySelector('base-element') as any;
            await el.renderComplete;
            expect(el.getFeedback()).to.be.undefined;
        });

        it('should return current value on getValue', async (): Promise<void> => {
            withSnippet('base');
            const el: BaseElement = document.querySelector('base-element') as any;
            await el.renderComplete;
            el.value = 'some value';
            await el.renderComplete;
            expect(el.getValue()).to.equal('some value');
        });
    });
}
