import React from 'react'
import { Route, Switch } from 'react-router-dom'
import SuperRoute from './SuperRoute'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import Login from '../components/auth/Login.jsx'
import Register from '../components/auth/Register.jsx'
import Superdashboard from '../components/dashboards/Superdashboard.jsx'
import Admindashboard from '../components/dashboards/Admindashboard.jsx'
import Userdashboard from '../components/dashboards/Userdashboard.jsx'
import CurrentUser from '../components/users/CurrentUser.jsx'
import Profile from '../components/users/Profile.jsx'

const Routes = () => {
  return (
    <section>
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <SuperRoute exact path='/superdashboard' component={Superdashboard} />
        <SuperRoute exact path='/superprofile' component={CurrentUser} />
        <AdminRoute exact path='/admindashboard' component={Admindashboard} />
        <AdminRoute exact path='/adminprofile' component={CurrentUser} />
        <PrivateRoute exact path='/userdashboard' component={Userdashboard} />
        <PrivateRoute exact path='/userprofile' component={CurrentUser} />
        <PrivateRoute exact path='/profile' component={Profile} />
      </Switch>
    </section>
  )
}

export default Routes
