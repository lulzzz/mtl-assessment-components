export const mcqTagName: string = 'multiple-choice-question';
export const mrqTagName: string = 'multiple-response-question';
export const expect: any = chai.expect;
export async function sleep(){
    await new Promise((done: any)=> setTimeout(done, 10));
}