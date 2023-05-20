/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FullPageSpinner, FullPageErrorFallback } from './components/lib'
import { useAuth } from 'context/auth-context'
import { AuthenticatedApp } from './authenticated-app'
import { UnauthenticatedApp } from './unauthenticated-app'


function App() {
  const { isLoading, isIdle, isError, isSuccess, user, error } = useAuth();

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    return user ? < AuthenticatedApp /> : <UnauthenticatedApp />;


  }
}

export { App }
