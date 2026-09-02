import { randomNewArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let commentView: AddCommentView;
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    commentView = new AddCommentView(page);
    commentPage = new CommentPage(page);

    articleData = randomNewArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('create new comment @GAD-R05-01', async ({ page }) => {
    //Create new comment
    //Arrange
    const expectedAddCommentHeader = 'Add New Comment';
    const expectedCommentCreatedPopup = 'Comment was created';
    const commentText = 'Hello mordo';

    //Act
    await articlePage.addCommentButton.click();
    await expect(commentView.header).toHaveText(expectedAddCommentHeader);
    await commentView.bodyInput.fill(commentText);
    await commentView.saveButton.click();

    //Assert
    await expect(articlePage.articleErrorText).toHaveText(
      expectedCommentCreatedPopup,
    );

    //Verify comment
    //Act
    const articleComment = articlePage.getArticleComment(commentText);
    await expect(articleComment.body).toHaveText(commentText);
    await articleComment.link.click();

    //Assert
    await expect(commentPage.commentBody).toHaveText(commentText);
  });
});
