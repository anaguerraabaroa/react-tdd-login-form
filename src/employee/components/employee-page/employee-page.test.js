import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {render, screen} from '@testing-library/react'

import {EmployeePage} from './employee-page'
import {AuthContext} from '../../../utils/contexts/auth-context'
import {ADMIN_ROLE, EMPLOYEE_ROLE} from '../../../consts'

const renderWith = ({role, username = 'John Doe'}) => {
  render(
    <AuthContext.Provider value={{user: {username, role}}}>
      <EmployeePage />
    </AuthContext.Provider>,
    {wrapper: Router},
  )
}

// validate admin has access to delete button when access to the employee page
describe('when the admin access to employee page', () => {
  it('must have access to delete the employee button', () => {
    renderWith({role: ADMIN_ROLE})

    expect(screen.getByRole('button', {name: /delete/i})).toBeInTheDocument()
  })
})

// validate employee has not access to delete button when access to the employee page
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
