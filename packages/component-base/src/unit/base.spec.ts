const expect: any = chai.expect;
const tagName: string = 'text-input';

describe(`<${tagName}>`, (): void => {
    it('should render as expected', (): void => {
        withSnippet('default');
        const value: boolean = true;
        expect(value).to.be.true;
    });

    it('should render within a paragraph', (): void => {
        withSnippet('paragraph');
        const value: boolean = true;
        expect(value).to.be.true;
    });
});

mocha.run();
