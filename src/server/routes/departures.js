const ENTUR_GRAPHQL_URL = "https://api.entur.io/journey-planner/v3/graphql";
const ET_CLIENT_NAME = "homey-dashboard-entre";
const CACHE_TTL_MS = 20 * 1000;
const DEPARTURES_PER_STOP = 3;
const FETCH_PER_QUAY = 8;

const STOPS = [
  {
    id: "alna",
    title: "Alna tog",
    mode: "rail",
    quayId: "NSR:Quay:641",
    hiddenDestinationPattern: /lillestrøm/i,
  },
  {
    id: "rislokka",
    title: "Risløkka",
    mode: "metro",
    quayId: "NSR:Quay:10861",
    hiddenDestinationPattern: /vestli/i,
  },
];

const DEPARTURES_QUERY = `
  query WestboundDepartures($alnaQuayId: String!, $rislokkaQuayId: String!, $count: Int!) {
    alna: quay(id: $alnaQuayId) {
      id
      name
      estimatedCalls(numberOfDepartures: $count, whiteListedModes: [rail]) {
        realtime
        cancellation
        aimedDepartureTime
        expectedDepartureTime
        destinationDisplay { frontText }
        serviceJourney { line { publicCode transportMode } }
        situations { summary { language value } }
      }
    }
    rislokka: quay(id: $rislokkaQuayId) {
      id
      name
      estimatedCalls(numberOfDepartures: $count, whiteListedModes: [metro]) {
        realtime
        cancellation
        aimedDepartureTime
        expectedDepartureTime
        destinationDisplay { frontText }
        serviceJourney { line { publicCode transportMode } }
        situations { summary { language value } }
      }
    }
  }
`;

let cache = {
  payload: null,
  fetchedAt: null,
};

let inFlight = null;

const getNorwegianSummary = (situations) => {
  if (!Array.isArray(situations)) {
    return [];
  }
  return situations.flatMap((situation) => {
    const summaries = situation?.summary;
    if (!Array.isArray(summaries) || summaries.length === 0) {
      return [];
    }
    const norwegian = summaries.find((entry) => entry.language === "no");
    const text = norwegian?.value || summaries[0]?.value;
    return text ? [text] : [];
  });
};

const mapEstimatedCall = (call) => {
  const destination = call?.destinationDisplay?.frontText;
  const expectedTime = call?.expectedDepartureTime;
  if (!destination || !expectedTime) {
    return null;
  }
  return {
    line: call.serviceJourney?.line?.publicCode || "",
    transportMode: call.serviceJourney?.line?.transportMode || "",
    destination,
    expectedTime,
    aimedTime: call.aimedDepartureTime || expectedTime,
    realtime: Boolean(call.realtime),
    cancelled: Boolean(call.cancellation),
    situations: getNorwegianSummary(call.situations),
  };
};

const getStopDepartures = (quay, stop) => {
  const calls = Array.isArray(quay?.estimatedCalls) ? quay.estimatedCalls : [];
  const departures = [];

  calls.forEach((call) => {
    if (call?.cancellation) {
      return;
    }
    const mapped = mapEstimatedCall(call);
    if (!mapped) {
      return;
    }
    if (stop.hiddenDestinationPattern.test(mapped.destination)) {
      return;
    }
    if (departures.length < DEPARTURES_PER_STOP) {
      departures.push(mapped);
    }
  });

  return {
    id: stop.id,
    title: stop.title,
    mode: stop.mode,
    departures,
  };
};

const fetchDeparturesFromEntur = async () => {
  const response = await fetch(ENTUR_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "ET-Client-Name": ET_CLIENT_NAME,
    },
    body: JSON.stringify({
      query: DEPARTURES_QUERY,
      variables: {
        alnaQuayId: STOPS[0].quayId,
        rislokkaQuayId: STOPS[1].quayId,
        count: FETCH_PER_QUAY,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Entur departures request failed with ${response.status}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message || "Entur GraphQL error");
  }

  const payload = {
    source: "entur",
    stops: STOPS.map((stop) => getStopDepartures(json.data?.[stop.id], stop)),
  };

  cache = {
    payload,
    fetchedAt: Date.now(),
  };

  return cache;
};

const getCachedDepartures = async () => {
  const isFresh =
    cache.payload &&
    cache.fetchedAt != null &&
    Date.now() - cache.fetchedAt < CACHE_TTL_MS;

  if (isFresh) {
    return cache;
  }

  if (!inFlight) {
    inFlight = fetchDeparturesFromEntur().finally(() => {
      inFlight = null;
    });
  }

  try {
    return await inFlight;
  } catch (error) {
    if (cache.payload) {
      console.warn(
        "[departures] Entur refresh failed; serving stale cache:",
        error.message || error
      );
      return cache;
    }
    throw error;
  }
};

export const getDepartures = async (_req, res) => {
  try {
    const { payload, fetchedAt } = await getCachedDepartures();
    res.json({
      ...payload,
      fetchedAt: new Date(fetchedAt).toISOString(),
    });
  } catch (error) {
    console.error("[departures]", error);
    res.status(502).json({
      error: "entur_departures_failed",
      message: error.message || String(error),
    });
  }
};

export const registerDeparturesRoutes = (app) => {
  app.get("/api/read/departures", getDepartures);

  getCachedDepartures().catch((error) => {
    console.warn(
      "[departures] startup cache warm failed:",
      error.message || error
    );
  });
};
