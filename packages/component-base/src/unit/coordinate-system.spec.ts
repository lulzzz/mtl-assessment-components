import { CoordinateSystem } from '../components/coordinate-system';

const expect: any = chai.expect;

export default function() {
    describe('Coordinate System Element', (): void => {
        it('should render properly', async (): Promise<void> => {
            withSnippet('coordinate-system');
            const el: CoordinateSystem = document.querySelector('coordinate-system') as any;
            await el.updateComplete;

            const slot: HTMLSlotElement = el.shadowRoot.querySelector('slot');
            expect(slot).not.to.be.undefined;
            expect(slot instanceof Element).to.be.true;

            // @ts-ignore : private function
            expect(typeof el._onSlotChanged).to.equal('function');
            expect(el.getValue().length).to.equal(2);
        });
    });
}
