import { MultipleChoiceElement } from './fixture-elements';
import { Strategy } from '../mixins/feedback';
import { ResponseValidation } from '../components/response-validation';

const expect: any = chai.expect;

export default function() {
    describe('Multiple Choice Interaction Family', (): void => {
        it('should render as expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;
            const text: string = el.shadowRoot.querySelector('main').innerText;
            expect(text).to.equal('Hello MultipleChoiceElement');
        });

        it('should implement feedback methods', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            expect(typeof el.match).is.equal('function');
            expect(typeof el.showFeedback).is.equal('function');
            expect(typeof el.computeFeedback).is.equal('function');
            expect(typeof el._onFeedbackSlotChanged).is.equal('function');
        });

        it('should override exact match strategy with single expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match(
                {
                    expected: '1',
                    strategy: Strategy.EXACT_MATCH
                } as ResponseValidation,
                ['1']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '1',
                    strategy: Strategy.EXACT_MATCH
                } as ResponseValidation,
                ['2']
            );
            expect(matchResult).to.be.false;

            matchResult = el.match(
                {
                    expected: '1',
                    strategy: Strategy.EXACT_MATCH
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.false;
        });

        it('should override exact match strategy with multiple expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match(
                {
                    expected: '1|3|5',
                    strategy: Strategy.EXACT_MATCH
                } as ResponseValidation,
                ['1', '5', '3']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '1|2|3',
                    strategy: Strategy.EXACT_MATCH
                } as ResponseValidation,
                ['2']
            );
            expect(matchResult).to.be.false;

            matchResult = el.match(
                {
                    expected: '1|3',
                    strategy: Strategy.EXACT_MATCH
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.false;
        });

        it('should override contains strategy with single expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match(
                {
                    expected: '1',
                    strategy: Strategy.CONTAINS
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '1',
                    strategy: Strategy.CONTAINS
                } as ResponseValidation,
                ['2', '5', '9']
            );
            expect(matchResult).to.be.false;

            matchResult = el.match(
                {
                    expected: '1',
                    strategy: Strategy.CONTAINS
                } as ResponseValidation,
                []
            );
            expect(matchResult).to.be.false;
        });

        it('should override contains strategy with multiple expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match(
                {
                    expected: '1|3',
                    strategy: Strategy.CONTAINS
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '1|4',
                    strategy: Strategy.CONTAINS
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.false;
        });

        it('should override any strategy with single expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match(
                {
                    expected: '1',
                    strategy: Strategy.CONTAINS
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '1',
                    strategy: Strategy.ANY
                } as ResponseValidation,
                ['2', '5', '9']
            );
            expect(matchResult).to.be.false;

            matchResult = el.match(
                {
                    expected: '1',
                    strategy: Strategy.ANY
                } as ResponseValidation,
                []
            );
            expect(matchResult).to.be.false;
        });

        it('should override any strategy with multiple expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match(
                {
                    expected: '1|3',
                    strategy: Strategy.ANY
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '1|4',
                    strategy: Strategy.ANY
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '2|4',
                    strategy: Strategy.ANY
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.false;
        });

        it('should default to exact match strategy with single expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match(
                {
                    expected: '1'
                } as ResponseValidation,
                ['1']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '1'
                } as ResponseValidation,
                ['2']
            );
            expect(matchResult).to.be.false;

            matchResult = el.match(
                {
                    expected: '1'
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.false;
        });

        it('should always match is no expected value specified (catch-all)', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match({} as ResponseValidation, ['1']);
            expect(matchResult).to.be.true;

            matchResult = el.match({} as ResponseValidation, ['2']);
            expect(matchResult).to.be.true;

            matchResult = el.match({} as ResponseValidation, ['1', '3', '5']);
            expect(matchResult).to.be.true;
        });

        it('should default to exact match strategy with multiple expected', async (): Promise<void> => {
            withSnippet('multiple-choice');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            let matchResult: boolean = el.match(
                {
                    expected: '1|3|5'
                } as ResponseValidation,
                ['1', '5', '3']
            );
            expect(matchResult).to.be.true;

            matchResult = el.match(
                {
                    expected: '1|2|3'
                } as ResponseValidation,
                ['2']
            );
            expect(matchResult).to.be.false;

            matchResult = el.match(
                {
                    expected: '1|3'
                } as ResponseValidation,
                ['1', '3', '5']
            );
            expect(matchResult).to.be.false;
        });

        it('should load all answer options', async (): Promise<void> => {
            withSnippet('multiple-choice-options');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            // @ts-ignore : access to protected member
            expect(el.items.length).to.equal(6);
        });

        it('should handle programmatically modifying answer options', async (): Promise<void> => {
            withSnippet('multiple-choice-options');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;

            const options: NodeListOf<HTMLDivElement> = el.querySelectorAll('[slot=options]');

            // @ts-ignore : access to protected member
            expect(el.items.length).to.equal(options.length);

            el.removeChild(options[1]);
            await el.renderComplete;
            // @ts-ignore : access to protected member
            expect(el.items.length).to.equal(options.length - 1);
            el.removeChild(options[3]);
            await el.renderComplete;
            // @ts-ignore : access to protected member
            expect(el.items.length).to.equal(options.length - 2);
        });

        it('should select item when user clicks on it (single mode)', async (): Promise<any> => {
            withSnippet('multiple-choice-options');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;
            // @ts-ignore : access to protected member
            expect(el.items.length).to.equal(6);
            expect(el.getValue()).to.deep.equal([]);

            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '2');
            await el.renderComplete;
            expect(el.getValue()).to.deep.equal(['2']);

            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '4');
            await el.renderComplete;
            expect(el.getValue()).to.deep.equal(['4']);

            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '1');
            await el.renderComplete;
            expect(el.getValue()).to.deep.equal(['1']);

            // DESELECTION
            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '1');
            await el.renderComplete;
            expect(el.getValue()).to.deep.equal([]);
        });

        it('should select items when user clicks on it (multiple mode)', async (): Promise<any> => {
            withSnippet('multiple-choice-options');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;
            await el.renderComplete;
            // @ts-ignore : access to protected member
            expect(el.items.length).to.equal(6);
            expect(el.getValue()).to.deep.equal([]);

            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '2', true);
            await el.renderComplete;
            expect(el.getValue()).to.deep.equal(['2']);

            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '4', true);
            await el.renderComplete;
            expect(el.getValue().sort()).to.deep.equal(['2', '4'].sort());

            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '1', true);
            await el.renderComplete;
            expect(el.getValue().sort()).to.deep.equal(['1', '2', '4'].sort());

            // DESELECTION
            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '2', true);
            await el.renderComplete;
            expect(el.getValue().sort()).to.deep.equal(['1', '4'].sort());
        });

        it('should fire change event on selection', (done: () => void): void => {
            withSnippet('multiple-choice-options');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;

            el.addEventListener('change', (event: CustomEvent) => {
                expect(event.srcElement).to.equal(el);
                expect(event.detail.value).to.deep.equal(['2']);
                done();
            });

            // @ts-ignore : access to protected member
            el._onItemClicked(new Event('click'), '2');
        });

        it('should not throw is there is no options slot', async (): Promise<void> => {
            withSnippet('multiple-choice-options');
            const el: MultipleChoiceElement = document.querySelector('multiple-choice-element') as any;

            // @ts-ignore : access to protected member
            expect(() => el._onSlotChanged(new Event('slotchange'))).not.to.throw();
        });
    });
}
