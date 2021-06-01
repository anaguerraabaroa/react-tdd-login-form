import React from 'react'
import {screen} from '@testing-library/react'

import {AdminPage} from './admin-page'
import {AuthContext} from '../../../utils/contexts/auth-context'
import {renderWithAuthProvider} from '../../../utils/tests'

// validate that username is displayed when admin page is mounted
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
