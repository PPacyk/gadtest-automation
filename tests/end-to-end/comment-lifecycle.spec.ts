import { randomNewArticle } from '../../src/factories/article.factory';
import { prepareRandomComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { EditCommentView } from '../../src/views/edit-comment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let commentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    commentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);

    articleData = randomNewArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('create new comment @GAD-R05-01', async () => {
    //Create new comment
    //Arrange
    const expectedAddCommentHeader = 'Add New Comment';
    const expectedCommentCreatedPopup = 'Comment was created';
    const expectedCommentUpdatedPopup = 'Comment was updated';

    const newCommentData = prepareRandomComment();

    //Act
    await articlePage.addCommentButton.click();
    await expect(commentView.header).toHaveText(expectedAddCommentHeader);
    await commentView.createComment(newCommentData);

    //Assert
    await expect(articlePage.articleErrorText).toHaveText(
      expectedCommentCreatedPopup,
    );

    //Verify comment
    //Act
    const articleComment = articlePage.getArticleComment(newCommentData.body);
    await expect(articleComment.body).toHaveText(newCommentData.body);
    await articleComment.link.click();

    //Assert
    await expect(commentPage.commentBody).toHaveText(newCommentData.body);

    //Edit comment
    const editedCommentData = prepareRandomComment();

    await commentPage.editButton.click();
    await editCommentView.updateComment(editedCommentData);
    await expect(commentPage.commentBody).toHaveText(editedCommentData.body);
    await expect(commentPage.alertPopup).toHaveText(
      expectedCommentUpdatedPopup,
    );
    await commentPage.returnLink.click();

    const updatedArticleComment = articlePage.getArticleComment(
      editedCommentData.body,
    );
    await expect(updatedArticleComment.body).toHaveText(editedCommentData.body);
  });
});
