import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {render, screen, fireEvent} from '@testing-library/react'

import {AuthGuard} from './components/auth-guard'

export const renderWithRouter = (ui, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)

  return render(ui, {wrapper: Router})
}

export const renderWithAuthProvider = (
  ui,
  {isAuth = false, role = ''} = {},
) => {
  return render(
    <AuthGuard isAuth={isAuth} initialRole={role}>
      {ui}
    </AuthGuard>,
    {
      wrapper: Router,
    },
  )
}

export const goTo = route => window.history.pushState({}, 'Test page', route)

// fill inputs
export const fillInputs = ({
  email = 'john.doe@test.com',
  password = 'Aa123456789!@#',
} = {}) => {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: {value: email},
  })

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: {value: password},
  })
}

// submit info
export const getSendButton = () => screen.getByRole('button', {name: /send/i})

export default {
  renderWithRouter,
  renderWithAuthProvider,
  goTo,
  fillInputs,
  getSendButton,
}
