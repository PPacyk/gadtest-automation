import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test('register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const userFirstName = 'Przemyslaw';
    const userLastName = 'Nowak';
    const userPassword = 'testtestprzemek';
    const userEmail = `pntes${new Date().getTime()}@test.test`;

    const registerPage = new RegisterPage(page);

    // Act
    await registerPage.goto();
    await registerPage.register(
      userFirstName,
      userLastName,
      userEmail,
      userPassword,
    );

    const expectedAlertPopupText = 'User created';

    // Assert
    await expect(registerPage.alertPopUp).toHaveText(expectedAlertPopupText);
    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadUrl();
    const title = await loginPage.title();
    expect.soft(title).toContain('Login');

    // Assert
    await loginPage.login(userEmail, userPassword);

    const welcomePage = new WelcomePage(page);
    const titleWelcome = await welcomePage.title();
    expect(titleWelcome).toContain('Welcome');
  });
});
