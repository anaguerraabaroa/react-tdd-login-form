import React, {useContext} from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import {AuthContext} from '../../../utils/contexts/auth-context'
import {UserLayout} from '../../../utils/components/user-layout'
import {ADMIN_ROLE} from '../../../consts'

export const EmployeePage = () => {
  const {user} = useContext(AuthContext)

  return (
    <UserLayout user={user}>
      <Typography component="h1" variant="h5">
        Employee Page
      </Typography>

      {user.role === ADMIN_ROLE && (
        <Button type="button" variant="contained" color="primary">
          Delete
        </Button>
      )}
    </UserLayout>
  )
}

export default {
  EmployeePage,
}
