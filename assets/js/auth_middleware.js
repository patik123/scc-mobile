export default {
  middleware({ $auth, redirect }) {
    if (!$auth.loggedIn) {
      redirect({ path: '/', params: { reason: 'neprijavljen' } })
    }
  },
}
