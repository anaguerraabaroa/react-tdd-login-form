import React from 'react'
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'

import {LoginPage} from './auth/components/login-page'
import {PrivateRoute} from './utils/components/private-route'
import {AdminPage} from './admin/components/admin-page'
import {EmployeePage} from './employee/components/employee-page'
import {ADMIN_ROLE} from './consts'

export const AppRouter = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
        <PrivateRoute path="/admin" allowRoles={[ADMIN_ROLE]}>
          <AdminPage />
        </PrivateRoute>
        <PrivateRoute path="/employee">
          <EmployeePage />
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default {
  AppRouter,
}
