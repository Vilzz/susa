import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Login from '../components/auth/Login.jsx'
import Register from '../components/auth/Register.jsx'

const Routes = () => {
  return (
    <section>
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
      </Switch>
    </section>
  )
}

export default Routes
