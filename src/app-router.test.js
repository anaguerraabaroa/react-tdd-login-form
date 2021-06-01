import React from 'react'
import {screen, fireEvent} from '@testing-library/react'
import {setupServer} from 'msw/node'

import {
  renderWithAuthProvider,
  goTo,
  fillInputs,
  getSendButton,
} from './utils/tests'
import {handlers} from './mocks/handlers'
import {AppRouter} from './app-router'
import {ADMIN_ROLE, EMPLOYEE_ROLE, ADMIN_EMAIL, EMPLOYEE_EMAIL} from './consts'

// initialize server
const server = setupServer(...handlers)

// enable API mocking before tests
beforeAll(() => server.listen())

// reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers())

// disable API mocking after the tests are done
afterAll(() => server.close())

// validate redirection to login page when user is not authenticated
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

// this test works when admin role was not required at the beginning of the exercise
// describe('when the user is authenticated and enters on admin page', () => {
//   it('must be redirected to login page', () => {
//     goTo('/admin')
//     renderWithAuthProvider(<AppRouter />, {isAuth: true})

//     expect(screen.getByText(/admin page/i)).toBeInTheDocument()
//   })
// })

// validate redirection to admin page when admin is authenticated
describe('when the admin is authenticated in login page', () => {
  it('must be redirected to admin page', async () => {
    renderWithAuthProvider(<AppRouter isAuth />)

    fillInputs({email: ADMIN_EMAIL})

    fireEvent.click(getSendButton())

    expect(await screen.findByText(/admin page/i)).toBeInTheDocument()
    expect(await screen.findByText(/john doe/i)).toBeInTheDocument()
  })
})

// validate admin has access to employee page
describe('when the admin goes to employees page', () => {
  it('must have access', () => {
    goTo('/admin')
    renderWithAuthProvider(<AppRouter />, {isAuth: true, role: ADMIN_ROLE})

    fireEvent.click(screen.getByText(/employee/i))

    expect(screen.getByText(/employee page/i)).toBeInTheDocument()
  })
})

// validate redirection to employee page when employee is authenticated
describe('when the employee is authenticated in login page', () => {
  it('must be redirected to employee page', async () => {
    renderWithAuthProvider(<AppRouter isAuth />)

    fillInputs({email: EMPLOYEE_EMAIL})

    fireEvent.click(getSendButton())

    expect(await screen.findByText(/employee page/i)).toBeInTheDocument()
  })
})

describe('when the employee goes to admin page', () => {
  it('must redirect to employee page', () => {
    goTo('/admin')

    renderWithAuthProvider(<AppRouter />, {isAuth: true, role: EMPLOYEE_ROLE})

    expect(screen.getByText(/employee page/i)).toBeInTheDocument()
  })
})
