import { expect, basicTagName } from './constants.spec';
import { DragDrop } from '../components/drag-drop';

export default () => {
    describe(`<${basicTagName}> feedback`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.renderComplete;

            element.showFeedback();
            expect(element.dropContainers[0].getFeedback().type).to.equal('negative');
        });

        it('should provide positive feedback on correct answer', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.renderComplete;
            // plain javascript
            var dragSource = element.dragContainers[0].getElement('000-1');
            var dropTarget = element.dropContainers[0];
            console.log(element.dragContainers[0]);

            const dragEvent: Event = new DragEvent('dragstart');
            dragSource.dispatchEvent(dragEvent);

            //  expect(element.drag).to.be.called;
            const event: Event = new DragEvent('drop');
            dragSource.dispatchEvent(event);

            console.log(element.dragContainers[0]);
            element.showFeedback();
            expect(element.dropContainers[0].getFeedback().type).to.equal('positive');
        });
    });
};
