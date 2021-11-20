export default {
  middleware({ $auth, redirect, $moment }) {
    if (!$auth.loggedIn) {
      redirect({ path: '/', params: { reason: 'neprijavljen' } })
    }
    if($auth.strategy.refreshToken.status().expired()){
      redirect({ path: '/', params: { reason: 'expired' } })
    }
    $auth.refreshTokens()
  },
}
