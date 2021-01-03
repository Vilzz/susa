import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import './scss/App.scss'
import Mainnav from './components/navs/Mainnav.jsx'
import Alerts from './components/helpers/Alerts.jsx'
import Routes from './routing/Routes'
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <>
          <Mainnav />
          <Alerts />
          <Switch>
            <Routes component={Routes} />
          </Switch>
        </>
      </Router>
    </Provider>
  )
}
export default App
