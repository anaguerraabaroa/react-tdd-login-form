import React from 'react'
import {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import LoginPage from './login-page'
import {handlers, handlerInvalidCredentials} from '../../../mocks/handlers'
import {HTTP_UNEXPECTED_ERROR_STATUS} from '../../../consts'
import {renderWithRouter, fillInputs, getSendButton} from '../../../utils/tests'
import {AuthContext} from '../../../utils/contexts/auth-context'

// // get password
const getPasswordInput = () => screen.getByLabelText(/password/i)

// get password validation message
const passwordValidationMessage =
  'The password must contain at least 8 characters, one upper case letter, one number and one special character'

// initialize server
const server = setupServer(...handlers)

// render component before each test
beforeEach(() =>
  renderWithRouter(
    <AuthContext.Provider
      value={{handleSuccessLogin: jest.fn(), user: {role: ''}}}
    >
      <LoginPage />
    </AuthContext.Provider>,
  ),
)

// enable API mocking before tests
beforeAll(() => server.listen())

// reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers())

// disable API mocking after the tests are done
afterAll(() => server.close())

// render login page & form
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

// render validation messages (when fields are empty)
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

// not render validation messages (when fields are filled)
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

// email validation
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

// password validation
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

// manage submit button and loading
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

// server errors
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
