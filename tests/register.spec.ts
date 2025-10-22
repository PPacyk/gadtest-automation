import { randomUserData } from '../src/factories/user.factory';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test('register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const registerUserData = randomUserData();
    const registerPage = new RegisterPage(page);

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);
    const expectedAlertPopupText = 'User created';

    // Assert
    await expect(registerPage.alertPopUp).toHaveText(expectedAlertPopupText);
    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadUrl();
    const title = await loginPage.title();
    expect.soft(title).toContain('Login');

    // Assert
    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const welcomePage = new WelcomePage(page);
    const titleWelcome = await welcomePage.title();
    expect(titleWelcome).toContain('Welcome');
  });

  test('not register with incorrect data - non valid email @GAD_R03_04', async ({
    page,
  }) => {
    //Arrange
    const registerUserData = randomUserData();
    registerUserData.userEmail = '!@#';

    const registerPage = new RegisterPage(page);
    const expectedErrorText = 'Please provide a valid email address';

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    // Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test('not register with incorrect data - email not provided @GAD_R03_04', async ({
    page,
  }) => {
    //Arrange
    const expectedErrorText = 'This field is required';
    const registerUserData = randomUserData();

    const registerPage = new RegisterPage(page);

    // Act
    await registerPage.goto();
    await registerPage.userFirstNameInput.fill(registerUserData.userFirstName);
    await registerPage.userLastNameInput.fill(registerUserData.userLastName);
    await registerPage.userPasswordInput.fill(registerUserData.userPassword);
    await registerPage.registerButton.click();

    // Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
});
