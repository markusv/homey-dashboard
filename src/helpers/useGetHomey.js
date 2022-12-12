/* global AthomCloudAPI */
import { useEffect, useState } from 'react'
import config from '../config'
const AthomCloudAPI = require('homey-api/lib/AthomCloudAPI');

const getHomey = async () => {
  var api = new AthomCloudAPI({
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
  });

  const params = new URLSearchParams(document.location.search);
  let token = params.get("token");
  try { token = atob(token) }
  catch(err) {
    throw new Error('Token invalid. Please log-in again');
    return
  }
  token = JSON.parse(token);
  api.setToken(token);
  const isLoggedIn = await api.isLoggedIn()
  if(!isLoggedIn) {
    throw new Error('Token Expired. Please log-in again');
  }
  const authenticatedUser = await api.getAuthenticatedUser();
  const firstHomey = await authenticatedUser.getFirstHomey();
  const homey = await firstHomey.authenticate();
  return homey;
}
export const useGetHomey = () => {
 const [homey, setHomey] = useState(null);
 useEffect(() => {
   async function fetchHomey() {
     setHomey(await getHomey())
   }
   fetchHomey()
 }, []);
 return [homey]
}