import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from 'react-nhost'

export default function PrivateRoute({ children, ...rest }) {
  const { signedIn } = useAuth()

  if (signedIn === null) {
    return <div>Loading...</div>
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        signedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
