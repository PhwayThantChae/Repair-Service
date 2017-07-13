import { RepairServiceProjectPage } from './app.po';

describe('repair-service-project App', () => {
  let page: RepairServiceProjectPage;

  beforeEach(() => {
    page = new RepairServiceProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
