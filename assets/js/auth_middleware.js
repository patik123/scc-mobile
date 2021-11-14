export default {
  middleware({ $auth, redirect, $moment }) {
    if (!$auth.loggedIn) {
      redirect({ path: '/', params: { reason: 'neprijavljen' } })
    }
    console.log($moment().format('YYYY-MM-DD HH:mm:ss'))
  },
}
