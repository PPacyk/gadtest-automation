import { LoginPage } from '../src/pages/login.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test('login with correct credentials @GAD_R02_01', async ({ page }) => {
    //Arrange
    const userEmail = 'wilma.langworth@test.test.dev';
    const userPassword = '4dzFC';
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    //Act
    await loginPage.login(userEmail, userPassword);
    const welcomePage = new WelcomePage(page);
    const title = await welcomePage.title();

    //Assert
    expect(title).toContain('Welcome');
  });
});
