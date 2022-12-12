const AthomCloudAPI = require('homey-api/lib/AthomCloudAPI');
let homeyApiPromise = null;

export const getHomey = async () => {
  if (homeyApiPromise) {
    return homeyApiPromise;
  }
  const cloudApi = new AthomCloudAPI({
    clientId: '5a8d4ca6eb9f7a2c9d6ccf6d',
    clientSecret: 'e3ace394af9f615857ceaa61b053f966ddcfb12a',
    redirectUrl: 'http://localhost',
  });
  const loggedIn = await cloudApi.isLoggedIn();
  console.log('loggedIn', loggedIn)
  if (!loggedIn) {
    if (cloudApi.hasAuthorizationCode()) {
      const token = await  cloudApi.authenticateWithAuthorizationCode();
    } else {
      window.location.href =  cloudApi.getLoginUrl();
      return;
    }
  }
  const user = await cloudApi.getAuthenticatedUser();
  const homey = await user.getFirstHomey();
  homeyApiPromise = homey.authenticate();
  return await homeyApiPromise;
}