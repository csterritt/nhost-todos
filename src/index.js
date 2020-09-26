import React from 'react'
import ReactDOM from 'react-dom'
import App from 'App'
import Login from 'components/Login'
import PrivateRoute from 'components/PrivateRoute'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { auth } from 'util/nhost'
import { NhostAuthProvider, NhostApolloProvider } from 'react-nhost'

ReactDOM.render(
  <React.StrictMode>
    <NhostAuthProvider auth={auth}>
      <NhostApolloProvider
        auth={auth}
        gqlEndpoint='https://hasura-MAGIC_STRING.nhost.app/v1/graphql'
      >
        <Router>
          <Switch>
            <PrivateRoute exact path='/'>
              <App />
            </PrivateRoute>

            <Route path='/login'>
              <Login />
            </Route>
          </Switch>
        </Router>
      </NhostApolloProvider>
    </NhostAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
