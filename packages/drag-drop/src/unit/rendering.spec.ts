import { expect, basicTagName, dropContainerTagName, dragContainerTagName } from './constants.spec';
import { DragDrop } from '../components/drag-drop';

export default () => {
    describe(`<${basicTagName}> default`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet('default');
            const value: boolean = true;
            expect(value).to.be.true;
        });
    });
    describe(`<${dragContainerTagName}> default drag container`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet(dragContainerTagName);
            const value: boolean = true;
            expect(value).to.be.true;
        });
    });
    describe(`<${dropContainerTagName}> default drop container`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet(dropContainerTagName);
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
        it('should  not be able to drop unsupported elements', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            let dragSource = element.dragContainers[0];
            const dropTarget = element.dropContainers[1];
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer });
            const dropEvent: Event = new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer });
            dragSource.dispatchEvent(dragEvent);
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            expect(dropTarget.addedItems.length).to.equal(0);
        });
        it('should respect the maximum number of items', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            let dragSource = element.dragContainers[0].getElement('000-1');
            const dropTarget = element.dropContainers[1];
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer });
            const dragOverEvent: Event = new DragEvent('dragover', { bubbles: true, dataTransfer: dataTransfer });
            const dropEvent: Event = new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer });
            dragSource.dispatchEvent(dragEvent);
            dragSource.dispatchEvent(dragOverEvent);
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            dragSource = element.dragContainers[0].getElement('000-2');
            dragSource.dispatchEvent(dragEvent);

            await element.updateComplete;
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            expect(dropTarget.addedItems.length).to.equal(1);
        });
        it('should rbe able to move from drop container to drag zone', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            let dragSource = element.dragContainers[0].getElement('000-1');
            const dropTarget = element.dropContainers[1];
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer });
            const dropEvent: Event = new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer });
            dragSource.dispatchEvent(dragEvent);
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            dropTarget.getElement('000-1').dispatchEvent(dragEvent);
            element.dragContainers[0].dispatchEvent(dropEvent);
            await element.updateComplete;

            expect(element.dragContainers[0].getElement('000-1')).to.equal(dragSource);
        });
    });
};
