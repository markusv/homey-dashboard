import "./App.css";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchFavoriteDevices } from "./redux/favoriteDevices";
import { fetchFavoriteFlows } from "./redux/favoriteFlows";
import { fetchFlows } from "./redux/flows";
import { useGetHomey } from "./helpers/useGetHomey";
import { useGetFavoriteIds } from "./helpers/useGetFavoriteIds";
import { Devices } from "./components/Devices/Devices";
import { Flows } from "./components/Flows/Flows";
//import '@shoelace-style/shoelace/dist/themes/light.css';
import "@shoelace-style/shoelace/dist/themes/dark.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { useGetDevices } from "./helpers/useGetDevices";
import { useGetFlows } from "./helpers/useGetFlows";
import { Moods } from "./components/Moods/Moods";
import { triggerFlow } from "./components/Flows/helpers/triggerFlow";
import { Rullegardiner } from "./components/Devices/VirtualDevices/Rullegardiner";
import { Garage } from "./components/Devices/VirtualDevices/Garage/Garage";
import { EntranceDoor } from "./components/Devices/VirtualDevices/EntranceDoor/EntranceDoor";
import { Dishwasher } from "./components/Devices/VirtualDevices/Dishwasher/Dishwasher";
import { Focus } from "./components/Focus/Focus";
import { FocusedElement } from "./components/Focus/FocusedElement/FocusedElement";
setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.83/dist/"
);

const AthomCloudAPI = require("homey-api/lib/AthomCloudAPI");

const getFavoriteFlows = (favoriteFlowIds, flows) => {
  if (!favoriteFlowIds || !flows) {
    return null;
  }
  return favoriteFlowIds
    .map((favoriteDeviceId) => {
      return flows[favoriteDeviceId];
    })
    .filter((favoriteFlow) => !!favoriteFlow);
};

const init = async () => {
  /*const cloudApi = new AthomCloudAPI({
    clientId: '5a8d4ca6eb9f7a2c9d6ccf6d',
    clientSecret: 'e3ace394af9f615857ceaa61b053f966ddcfb12a',
    //token: JSON.parse(atob(decodeURIComponent('eyJfX2F0aG9tX2FwaV90eXBlIjoiQXRob21DbG91ZEFQSS5Ub2tlbiIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJhY2Nlc3NfdG9rZW4iOiIyY2EzN2Y2MjhlY2ZiMzc4MzBmNjg3ZjA5YmYwN2ZhYzczZTQ1ZDkyIiwiZXhwaXJlc19hdCI6IjIwMjItMTEtMTZUMTk6NTA6MjMuMDk5WiIsInJlZnJlc2hfdG9rZW4iOiJjOTRlMTUxNTkwNjhkZDc0MWI1NDhjODMxOWFlNjg4NjQ0NzUzODU2In0%3D')))
    token: new AthomCloudAPI.Token(JSON.parse(atob(decodeURIComponent('eyJfX2F0aG9tX2FwaV90eXBlIjoiQXRob21DbG91ZEFQSS5Ub2tlbiIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJhY2Nlc3NfdG9rZW4iOiIyY2EzN2Y2MjhlY2ZiMzc4MzBmNjg3ZjA5YmYwN2ZhYzczZTQ1ZDkyIiwiZXhwaXJlc19hdCI6IjIwMjItMTEtMTZUMTk6NTA6MjMuMDk5WiIsInJlZnJlc2hfdG9rZW4iOiJjOTRlMTUxNTkwNjhkZDc0MWI1NDhjODMxOWFlNjg4NjQ0NzUzODU2In0%3D'))))
  });
  console.log('logedin', await cloudApi.isLoggedIn());
  const user = await cloudApi.getAuthenticatedUser();
  console.log('user', user)*/

  const cloudApi = new AthomCloudAPI({
    clientId: "5a8d4ca6eb9f7a2c9d6ccf6d",
    clientSecret: "e3ace394af9f615857ceaa61b053f966ddcfb12a",
    redirectUrl: "http://localhost",
  });
  /*const params = new URLSearchParams(document.location.search);
  let token = params.get("token");
  try { token = atob(token) }
  catch(err) {
    throw new Error('Token invalid. Please log-in again');
    return
  }
  token = JSON.parse(token);
  cloudApi.authenticateWithAuthorizationCode(token)*/

  //console.log('loggedIn', loggedIn)
  const loggedIn = await cloudApi.isLoggedIn();
  console.log("loggedIn", loggedIn);
  if (!loggedIn) {
    if (cloudApi.hasAuthorizationCode()) {
      const token = await cloudApi.authenticateWithAuthorizationCode();
    } else {
      window.location.href = cloudApi.getLoginUrl();
      return;
    }
  }
  const user = await cloudApi.getAuthenticatedUser();
  const homey = await user.getFirstHomey();
  const homeyApi = await homey.authenticate();
  const devices = await homeyApi.devices.getDevices();
  console.log("devices", devices);
  const flows = await homeyApi.flow.getFlows();
  const aFlows = await homeyApi.flow.getAdvancedFlows();
  console.log("flows", flows, aFlows);
  Object.keys(devices).map((key) => {
    const d = devices[key];
    if (d.name === "Dimmer Taklys Gjesterom/kontor") {
      console.log("device", d);
      d.makeCapabilityInstance("onoff", (value) => {
        console.log("new value", value);
      });
      homeyApi.devices
        .setCapabilityValue({
          deviceId: d.id,
          capabilityId: "onoff",
          value: true,
        })
        .catch(console.error);
    }
  });

  /* AthomCloudAPI.setConfig({
    clientId: "56d84892f8ea8fcd7952e70f",
    clientSecret: "JScLCb3WWTQGw9vHHejJSaup13ReWdYBsiH086Mh"
  });
  const cloud = new AthomCloudAPI();
  await cloud.authenticateWithPassword("username", "password");
  const user = await cloud.getAuthenticatedUser();
  console.log('user',user )
  const homeys = await user.getHomeys();
  const homeyAPI = await homeys[0].authenticate();*/

  /* const cloudApi = new AthomCloudAPI({
    clientId: '5a8d4ca6eb9f7a2c9d6ccf6d',
    clientSecret: 'e3ace394af9f615857ceaa61b053f966ddcfb12a',
    redirectUrl: 'http://localhost/oauth2/callback',
  });
  let t = atob("eyJfX2F0aG9tX2FwaV90eXBlIjoiQXRob21DbG91ZEFQSS5Ub2tlbiIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJhY2Nlc3NfdG9rZW4iOiIyY2EzN2Y2MjhlY2ZiMzc4MzBmNjg3ZjA5YmYwN2ZhYzczZTQ1ZDkyIiwiZXhwaXJlc19hdCI6IjIwMjItMTEtMTZUMTk6NTA6MjMuMDk5WiIsInJlZnJlc2hfdG9rZW4iOiJjOTRlMTUxNTkwNjhkZDc0MWI1NDhjODMxOWFlNjg4NjQ0NzUzODU2In0%3D")
  t = JSON.parse(t);
  const _token = await cloudApi.authenticateWithAuthorizationCode({ code: t });
  console.log('_token', _token)*/
};

const App = () => {
  //init();
  //const dispatch = useDispatch();
  //dispatch(fetchFavoriteDevices());
  //dispatch(fetchFavoriteFlows());
  //dispatch(fetchFlows());

  //const [homey] = useGetHomey();
  const [favoriteDeviceIds, favoriteFlowIds] = useGetFavoriteIds();
  const [devices] = useGetDevices();
  const [flows] = useGetFlows();
  const [focusElement, setFocusElement] = useState();
  /*const favoriteFlows = useMemo(() => getFavoriteFlows(favoriteFlowIds, flows), [favoriteFlowIds, flows]);*/
  useEffect(() => {
    if (!focusElement) {
      return;
    }
    const timer = setTimeout(clearFocus, focusElement.timer ?? 10000);
    return () => clearTimeout(timer);
  }, [focusElement]);

  if (!flows || !devices) {
    return null;
  }

  const onMoodClick = async (id) => {
    console.log("mood clicked", id);
  };

  const onDeviceClick = (obj) => {
    setFocusElement(obj);
  };

  const clearFocus = () => {
    if (focusElement) {
      setFocusElement(null);
    }
  };

  return (
    <div className="sl-theme-dark homey-dashboard">
      <div className="first-column">
        <Moods flows={flows} onMoodClick={onMoodClick} />
      </div>
      <div className="second-column">
        <div className="first-row">
          <div className="focus-area">
            {focusElement && focusElement.render(clearFocus)}
            {!focusElement && <Focus />}
          </div>
        </div>
        <div className="second-row">
          <Rullegardiner onClick={onDeviceClick} />
          <Garage onClick={onDeviceClick} />
          <EntranceDoor onClick={onDeviceClick} />
          <Dishwasher onClick={onDeviceClick} />
        </div>
      </div>
      {/*<Flows flowIds={favoriteFlowIds} />*/}
      {/*<Devices deviceIds={favoriteDeviceIds} />*/}
    </div>
  );
};

export default App;
