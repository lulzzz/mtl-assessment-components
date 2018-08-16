const expect: any = chai.expect;
const tagName: string = 'drop-down';

describe(`<${tagName}>`, (): void => {
    it('should render as expected', (): void => {
        withSnippet('default');
        const value: boolean = true;
        expect(value).to.be.true;
    });
});

mocha.run();
