![Form]()

# **React TDD Login Form**

## **About**

This project is part of the
[**Test Driven Development (TDD) en React JS**](https://www.udemy.com/course/tdd-react-js/?referralCode=F40803D2C4D2934AB038)
course.

This form has been developed applying Test Driven Development with
[<img src = "https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">](https://www.ecma-international.org/ecma-262/)
[<img src = "https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black">](https://es.reactjs.org/),
[<img src = "https://img.shields.io/badge/-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">](https://jestjs.io/),
[<img src = "https://img.shields.io/badge/-Testing Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white">](https://testing-library.com/),
[<img src = "https://img.shields.io/badge/-Mock_Service_Worker-E95420?style=for-the-badge">](https://mswjs.io/)
and
[<img src = "https://img.shields.io/badge/-Material_UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white">](https://material-ui.com/)

[**Project URL**]() is available on GitHub Pages.

**NOTE:** a [**mock server**](https://mswjs.io/) has been used to develop this
exercise.

## **Quick start guide**

Instructions to start this project:

### Installation

- Clone repository:

```
git clone [repository]
```

- Install NPM packages and dependencies:

```
npm install
```

- Run project on local server

```
npm start
```

### Tests

- Run tests:

```
npm run test
```

## **Features and usage**

**Login and Authentication**

As company app user, I want a login page as a way of have a protected access to
the app.

**Acceptance Criteria**

1. There must be a login page.

2. The login page must have a form with the following fields: email, password
   and a submit button.

```javascript
describe('when login page is mounted', () => {
  it('must display the login title', () => {
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })

  it('must have a form with the following fields: email, password and a submit button', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /send/i}))
  })
})
```

3. The email and password inputs are required.

4. If the user leaves empty fields and clicks the submit button, the login page
   should display required messages as the format: “The [field name] is
   required” aside of the proper field.

```javascript
describe('when the user leaves empty fields and clicks the submit button', () => {
  it('display required messages as the format: “The [field name] is required”', async () => {
    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/the password is required/i),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: /send/i}))

    expect(screen.getByText(/the email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/the password is required/i)).toBeInTheDocument()

    await waitFor(() => expect(getSendButton()).not.toBeDisabled())
  })
})
```

5. The email and password inputs are validated.

```javascript
describe('when the user fills the fields and clicks the submit button', () => {
  it('must not display the required messages', async () => {
    fillInputs()

    fireEvent.click(screen.getByRole('button', {name: /send/i}))

    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()

    expect(
      screen.queryByText(/the password is required/i),
    ).not.toBeInTheDocument()

    await waitFor(() => expect(getSendButton()).not.toBeDisabled())
  })
})
```

6. The email value should contain the proper email format (the “@”, domain
   value, etc).

```javascript
describe('when the user fills and blur the email input with invalid email, and then focus and change with valid value', () => {
  it('must not display a validation message', () => {
    const emailInput = screen.getByLabelText(/email/i)

    fireEvent.change(emailInput, {
      target: {value: 'invalid.email'},
    })

    fireEvent.blur(emailInput)

    expect(
      screen.getByText(/the email is invalid. example: john.doe@mail.com/i),
    ).toBeInTheDocument()

    fireEvent.change(emailInput, {
      target: {value: 'john.doe@mail.com'},
    })

    fireEvent.blur(emailInput)

    expect(
      screen.queryByText(/the email is invalid. example: john.doe@mail.com/i),
    ).not.toBeInTheDocument()
  })
})
```

7. The password input should contain at least: 8 characters, one upper case
   letter, one number and one special character.

```javascript
describe('when the user fills and blur the password input with a value with 7 character length', () => {
  it(`must display the validation message "The password must contain at least 8 characters,
  one upper case letter, one number and one special character"`, () => {
    const passwordSevenLengthVal = 'asdfghj'

    fireEvent.change(getPasswordInput(), {
      target: {value: passwordSevenLengthVal},
    })

    fireEvent.blur(getPasswordInput())

    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
  })
})

describe('when the user fills and blur the password input with a value without one upper case character', () => {
  it(`must display the validation message "The password must contain at least 8 characters,
  one upper case letter, one number and one special character"`, () => {
    const passwordWithoutUpperCaseVal = 'asdfghj8'

    fireEvent.change(getPasswordInput(), {
      target: {value: passwordWithoutUpperCaseVal},
    })

    fireEvent.blur(getPasswordInput())

    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
  })
})

describe('when the user fills and blur the password input with a value without one number', () => {
  it(`must display the validation message "The password must contain at least 8 characters,
  one upper case letter, one number and one special character"`, () => {
    const passwordWithoutNumb = 'asdfghjA'

    fireEvent.change(getPasswordInput(), {
      target: {value: passwordWithoutNumb},
    })

    fireEvent.blur(getPasswordInput())

    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
  })
})

describe(`when the user fills and blur the password input with without one special character and
then change with valid value and blur again`, () => {
  it(`must not display the validation message`, () => {
    const passwordWithoutSpecialChar = 'asdfghjA1a'
    const validPassword = 'aA1asdasda#'

    fireEvent.change(getPasswordInput(), {
      target: {value: passwordWithoutSpecialChar},
    })

    fireEvent.blur(getPasswordInput())

    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()

    fireEvent.change(getPasswordInput(), {
      target: {value: validPassword},
    })

    fireEvent.blur(getPasswordInput())

    expect(
      screen.queryByText(passwordValidationMessage),
    ).not.toBeInTheDocument()
  })
})
```

8. The password input should contain at least: 8 characters, one upper case
   letter, one number and one special character.

9. The form must send the data to a backend endpoint service.

10. The submit button should be disabbled while the form page is fetching the
    data. After fetching, the submit button does not have to be disabled.

11. There should be a loading indicator at the top of the form while it is
    fetching.

```javascript
describe('when the user submit the login form with valid data', () => {
  it('must disable the submit button while the form page is fetching the data', async () => {
    fillInputs()

    fireEvent.click(getSendButton())

    expect(getSendButton()).toBeDisabled()

    await waitFor(() => expect(getSendButton()).not.toBeDisabled())
  })

  it('must be a loading indicator at the top of the form while it is fetching', async () => {
    fillInputs()

    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()

    fireEvent.click(getSendButton())

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator'),
    )
  })
})
```

12. In a unexpected server error, the form page must display the error message
    “Unexpected error, please try again” from the api.

13. In the invalid credentials response, the form page must display the error
    message “The email or password are not correct” from the api.

14. Not authenticated users must be redirected to the login page on enter to
    private pages (employees and admin pages).

```javascript
describe('when the user submit the login form with valid data and there is an unexpected server error', () => {
  it('must display the error message "Unexpected error, please try again" from the api', async () => {
    server.use(
      rest.post('/login', (req, res, ctx) =>
        res(
          ctx.status(HTTP_UNEXPECTED_ERROR_STATUS),
          ctx.json({message: 'Unexpected error, please try again'}),
        ),
      ),
    )

    expect(
      screen.queryByText(/unexpected error, please try again/i),
    ).not.toBeInTheDocument()

    fillInputs()

    fireEvent.click(getSendButton())

    expect(
      await screen.findByText(/unexpected error, please try again/i),
    ).toBeInTheDocument()
  })
})

describe('when the user submit the login form with valid data and there is an invalid credentials error', () => {
  it('must display the error message "The email or password are not correct" from the api', async () => {
    const wrongEmail = 'wrong@mail.com'
    const wrongPassword = 'Aa12345678$'

    server.use(handlerInvalidCredentials({wrongEmail, wrongPassword}))

    expect(
      screen.queryByText(/the email or password are not correct/i),
    ).not.toBeInTheDocument()

    fillInputs({email: wrongEmail, password: wrongPassword})

    fireEvent.click(getSendButton())

    expect(
      await screen.findByText(/the email or password are not correct/i),
    ).toBeInTheDocument()
  })
})
```

**Authorization**

As admin, I want to have full access to the company app modules: employees page
and admin page as a way of operate them.

**Acceptance Criteria**

1. The user must be redirected to the login page when is not authenticated and
   enters on the admin page or on the employee page.

```javascript
describe('when the user is not authenticated and enters on admin page', () => {
  it('must be redirected to login page', () => {
    goTo('/admin')
    renderWithAuthProvider(<AppRouter />)

    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
})

describe('when the user is not authenticated and enters on employee page', () => {
  it('must be redirected to login page', () => {
    goTo('/employee')
    renderWithAuthProvider(<AppRouter />)

    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
})
```

2. The admin must be redirected to the admin page after login.

```javascript
describe('when the admin is authenticated in login page', () => {
  it('must be redirected to admin page', async () => {
    renderWithAuthProvider(<AppRouter isAuth />)

    fillInputs({email: ADMIN_EMAIL})

    fireEvent.click(getSendButton())

    expect(await screen.findByText(/admin page/i)).toBeInTheDocument()
    expect(await screen.findByText(/john doe/i)).toBeInTheDocument()
  })
})
```

3. The admin username should be displayed on the common navbar.

```javascript
describe('when the admin page is mounted', () => {
  it('must display the admin username', () => {
    renderWithAuthProvider(
      <AuthContext.Provider value={{user: {username: 'John Doe'}}}>
        <AdminPage />
      </AuthContext.Provider>,
    )

    expect(screen.getByText(/john doe/i)).toBeInTheDocument()
  })
})
```

4. The admin must have access to the employees page.

```javascript
describe('when the admin goes to employees page', () => {
  it('must have access', () => {
    goTo('/admin')
    renderWithAuthProvider(<AppRouter />, {isAuth: true, role: ADMIN_ROLE})

    fireEvent.click(screen.getByText(/employee/i))

    expect(screen.getByText(/employee page/i)).toBeInTheDocument()
  })
})
```

5. The admin must have access to delete the employee button.

```javascript
describe('when the admin access to employee page', () => {
  it('must have access to delete the employee button', () => {
    renderWith({role: ADMIN_ROLE})

    expect(screen.getByRole('button', {name: /delete/i})).toBeInTheDocument()
  })
})
```

**Authorization**

As an employee, I want to have access to the employees page.

**Acceptance Criteria**

1. The employee must be redirected to the employees page after login and have
   access to employees page

```javascript
describe('when the employee is authenticated in login page', () => {
  it('must be redirected to employee page', async () => {
    renderWithAuthProvider(<AppRouter isAuth />)

    fillInputs({email: EMPLOYEE_EMAIL})

    fireEvent.click(getSendButton())

    expect(await screen.findByText(/employee page/i)).toBeInTheDocument()
  })
})
```

2. The employee must not have access to delete the employee button.

3. The employee username should be displayed on the common navbar.

```javascript
describe('when the employee access to employee page', () => {
  it('must not have access to delete the employee button', () => {
    renderWith({role: EMPLOYEE_ROLE})

    expect(
      screen.queryByRole('button', {name: /delete/i}),
    ).not.toBeInTheDocument()
  })

  it('the employee username should be displayed on the common navbar', () => {
    renderWith({role: EMPLOYEE_ROLE, username: 'Joana Doe'})

    expect(expect(screen.getByText(/joana doe/i)).toBeInTheDocument())
  })
})
```

4. The employee must not have access to the admin page.

5. The forbidden page access must be redirected to the allowed page.

```javascript
describe('when the employee goes to admin page', () => {
  it('must redirect to employee page', () => {
    goTo('/admin')

    renderWithAuthProvider(<AppRouter />, {isAuth: true, role: EMPLOYEE_ROLE})

    expect(screen.getByText(/employee page/i)).toBeInTheDocument()
  })
})
```

## **Folder Structure**

```
React TDD Login Form
├── docs
├── node_modules
├── public
├── src
│   ├── admin/components/admin-page
│   │   ├── admin-page.js
│   │   ├── admin-page.test.js
│   │   └── index.js
│   ├── auth
│   │   ├── components/login-page
│   │   │   ├── index.js
│   │   │   ├── login-page.js
│   │   │   └── login-page.test.js
│   │   └── services
│   │       └── index.js
│   ├── const
│   │       └── index.js
│   ├── employee/components/employee-page
│   │   ├── employee-page.js
│   │   ├── employee-page.test.js
│   │   └── index.js
│   ├── mocks
│   │   ├── browser.js
│   │   └── handlers.js
│   ├── utils
│   │   ├── components
│   │   │   ├── auth-guard.js
│   │   │   ├── private-route.js
│   │   │   └── user-layout.js
│   │   ├── contexts
│   │   │   └── auth-context.js
│   │   ├── helpers.js
│   │   └── tests.js
│   ├── app-router.js
│   ├── app-router.test.js
│   ├── App.js
│   ├── index.js
│   └── setupTests.js
|── .eslintrc
├── .gitignore
├── .prettierrc
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

## **License**

This project is licensed under
![GitHub](https://img.shields.io/github/license/anaguerraabaroa/random-number?label=License&logo=MIT&style=for-the-badge)
