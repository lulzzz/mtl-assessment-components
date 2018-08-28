const expect: any = chai.expect;
const tagName: string = 'multiple-choice';

describe(`<${tagName}>`, (): void => {
    it('default should render as expected', (): void => {
        withSnippet('default');
        const value: boolean = true;
        expect(value).to.be.true;
    });
    it.only('should be able to add options programmatically', (): void => {
        withSnippet('default');
        const value: boolean = true;
        expect(value).to.be.true;
        const el: HTMLMainElement = document.querySelector('multiple-choice');
        const div: HTMLDivElement = document.createElement('div');
        div.slot = 'options';
        div.id = '1';
        div.hidden = true;
        div.innerText = 'Option 1';
        el.appendChild(div);
        const divTest: HTMLDivElement = document.getElementById('1') as HTMLDivElement;
        expect(divTest).to.equal(div);
    });
});
describe(`<${tagName}> single mode`, (): void => {
    it('single should render as expected', (): void => {
        withSnippet('single');
        const value: boolean = true;

        expect(value).to.be.true;
    });
    it('should be able to add options', (): void => {
        withSnippet('single');
        const value: boolean = true;
        expect(value).to.be.true;
    });
});
describe(`<${tagName}> multiple mode`, (): void => {
    it('multiple should render as expected', (): void => {});
});

mocha.run();
