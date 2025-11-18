import { randomNewArticle } from '../src/factories/article.factory';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();

    await expect.soft(addArticleView.header).toBeVisible();
  });

  test('not create article with incorrect title @GAD_R04_01', async () => {
    //Arrange
    const expectedErrorText = 'Article was not created';
    const articleData = randomNewArticle();

    articleData.title = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.articleErrorText).toHaveText(expectedErrorText);
  });

  test('not create article with incorrect body @GAD_R04_01', async () => {
    //Arrange
    const expectedErrorText = 'Article was not created';
    const articleData = randomNewArticle();

    articleData.body = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.articleErrorText).toHaveText(expectedErrorText);
  });

  test.describe('title length', () => {
    test('not create article with title exceeding 128 signs @GAD_R04_02', async () => {
      //Arrange
      const expectedErrorText = 'Article was not created';
      const articleData = randomNewArticle(129);
      articleData.title = '';

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(addArticleView.articleErrorText).toHaveText(
        expectedErrorText,
      );
    });

    test('create article with title with 128 signs @GAD_R04_02', async ({
      page,
    }) => {
      //Arrange
      const articlePage = new ArticlePage(page);
      const articleData = randomNewArticle(128);
      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(articlePage.articleTitle).toHaveText(articleData.title);
    });
  });
});
