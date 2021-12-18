export default {
  middleware({ $auth, redirect, $moment }) {
    if (!$auth.loggedIn) {
      redirect({ path: '/', query: { reason: 'neprijavljen' } })
    }
    if ($auth.strategy.refreshToken.status().expired()) {
      redirect({ path: '/', query: { reason: 'expired' } })
    }
    $auth.refreshTokens()
  },
}
