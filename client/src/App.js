import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/auth'
import './scss/App.scss'
import Mainpage from './components/pages/Mainpage'
import Mainnav from './components/navs/Mainnav.jsx'
import Alerts from './components/helpers/Alerts.jsx'
import Routes from './routing/Routes'
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <>
          <Mainnav />
          <Alerts />
          <Switch>
            <Route exact path='/' component={Mainpage} />
            <Routes component={Routes} />
          </Switch>
        </>
      </Router>
    </Provider>
  )
}
export default App
