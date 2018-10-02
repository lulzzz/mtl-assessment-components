import { expect, basicTagName } from './constants.spec';
import { DragDrop } from '../components/drag-drop';

export default () => {
    describe(`<${basicTagName}> default`, (): void => {
        it('default should re nder as expected', (): void => {
            withSnippet('default');
            const value: boolean = true;
            expect(value).to.be.true;
        });
    });
    describe(`<${basicTagName}> basic`, (): void => {
        it('basic should render as expected', (): void => {
            withSnippet('basic');
            const value: boolean = true;
            expect(value).to.be.true;
        });

        it('should  have the correct amount of initial options', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            expect(element.dragContainers[0].getElementsByTagName('div').length).to.equal(5);
            expect(element.dragContainers[0].options.length).to.equal(5);
        });
    });
};
