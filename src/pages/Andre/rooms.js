/**
 * Data-driven room config for the 2nd-floor hallway dashboard.
 * Homey is source of truth for lights and blinds (via homeyZoneId) and capabilities.
 *
 * - temperatureDeviceId — live temp on card + Insights chart in detail
 * - airQualityDeviceId — optional override; otherwise temp sensor first, then first
 *   air-quality device in homeyZoneId (by name)
 * - primaryLightDeviceId — on/off status, dim level display, and color UI (+ color commands).
 *   Dim slider still commands every discovered light with `dim`.
 * - excludedLightDeviceIds — never discovered (e.g. Zigbee dimmer behind Hue, or lights
 *   Homey flows already mirror from another device)
 * - includeChildZoneLights — also discover lights in Homey child zones
 * - flows[].showOnRoomCard — also show this handling as an icon on the room overview card
 * - speakerFlows — flow buttons shown under the speaker player in room detail
 * - fanDeviceId — toggle fan (onoff) in Handlinger, with spinning icon when on
 * - heatPumpDeviceId — Daikin/AC controls in room detail (on/off, mode, setpoint, fan, powerful)
 *
 * Room card actions (overview):
 * - Lights / blinds: auto when Homey finds devices in the zone
 * - Speaker / vacuum: when speakerDeviceId / vacuumDeviceId is set
 * - Flows: only entries with showOnRoomCard: true
 */

/** Global shortcuts under the room grid on the /andre overview. */
export const overviewActions = [
  {
    id: "594fb90c-8b01-4389-904b-7a1d73cc26d6",
    label: "Kveldskos",
    icon: "moon",
  },
  {
    id: "033f2c8d-2de2-4ee6-b602-2d21b798ef8d",
    label: "Støvsug",
    icon: "vacuum",
  },
];

export const rooms = [
  {
    id: "adrian",
    name: "Adrian",
    homeyZoneId: "98942d58-6e30-40c8-ab6d-0f3d7919cef5",
    temperatureDeviceId: "641ce5ed-66b9-4ea9-bc61-9f70b74eb39e",
    primaryLightDeviceId: "7115bf4a-ed6b-455e-8919-c9ad45b98147", // Taklys Adrian 1
    excludedLightDeviceIds: [
      "1e3c4b2c-539a-45dd-b873-b10d60af89f8",
      "6f6f9699-91c0-46d9-9642-8ab05fd9be3b",
    ],
    flows: [
      {
        id: "649d042a-4bf9-4a73-976b-ccced03b5a61",
        label: "Sovemodus",
        icon: "moon",
        showOnRoomCard: true,
      },
    ],
  },
  {
    id: "fabian",
    name: "Fabian",
    homeyZoneId: "014b1a5d-6f62-49e0-b9d0-1b5b5c01e0b4",
    temperatureDeviceId: "1dc44f16-83d8-4897-b6ce-39345db80fec",
    primaryLightDeviceId: "4a4ed49d-40ea-4013-965a-09c6278e64da", // Taklys Fabian 1
    excludedLightDeviceIds: [
      "1f130830-581d-43e4-ba67-5b1a4d2ec2bc",
      "8d468312-7022-4ee1-8359-6d175d6c6543",
    ],
    speakerDeviceId: "8fd650ed-38d4-469f-b084-cdab2aac75e1", // Spotify Connect (AudioPro)
    speakerFlows: [
      {
        id: "47faf8f7-7b06-4344-95aa-614d7dddc4e3",
        label: "Spill lydbok",
        icon: "book",
      },
      {
        id: "78f78afa-508d-42fc-bff6-3e941917ed17",
        label: "Spill musikk",
        icon: "music-note-beamed",
      },
    ],
    flows: [
      {
        id: "4c0a1930-cdf3-489e-87d7-d14f3b62d419",
        label: "Sovemodus",
        icon: "moon",
        showOnRoomCard: true,
      },
      {
        id: "47faf8f7-7b06-4344-95aa-614d7dddc4e3",
        label: "Spill lydbok",
        icon: "book",
      },
      {
        id: "78f78afa-508d-42fc-bff6-3e941917ed17",
        label: "Spill musikk",
        icon: "music-note-beamed",
      },
    ],
  },
  {
    id: "hovedsoverom",
    name: "Hovedsoverom",
    homeyZoneId: "cc94f68d-30fb-482a-956b-2c551ccaf42c",
    temperatureDeviceId: "e5a8fd24-97f7-461b-bc4d-1014a1f85c89",
    primaryLightDeviceId: "1068b237-3368-4052-b544-9f8a5d189592", // Hovedsoverom taklys (Hue)
    fanDeviceId: "09c1dc9e-baea-4416-801f-728533e015bc", // Hovedsoverom vifte
    vacuumDeviceId: "36b2f0df-c217-4f45-92a5-c15d3d5dd34b",
    includeChildZoneLights: true,
    excludedLightDeviceIds: [
      "1a1c7e48-f46a-4dfe-bb2e-ee9ba7d5c6e5", // Dimmer Taklys Hovedsoverom (Hue styrer)
      "130f4ef6-01b7-4fe2-b033-a731c3f81ac0", // Hovedbad LED — Homey-flow speiler fra Taklys hovedbad
      "3e1ad162-c567-4a1b-a4b1-8b00654a06f3", // Servantskap — Homey-flow speiler fra Taklys hovedbad
    ],
    flows: [
      {
        id: "7f8fc5da-5229-489b-99db-9825aba998bc",
        label: "Litt lys",
        icon: "lightbulb",
      },
    ],
  },
  {
    id: "kontor",
    name: "Kontor",
    homeyZoneId: "5f67de23-2c24-4e71-8b75-da23ad4a8800",
    temperatureDeviceId: "f217627f-0d54-43a7-9d20-f88c99b25417",
    primaryLightDeviceId: "d5e8ff9f-5071-4777-8b16-691ecda398f4", // Dimmer Taklys
    excludedLightDeviceIds: ["39f8e9c0-0562-4ad4-a57e-3bc82a0facc5"],
    flows: [
      {
        id: "165e4efa-39db-45aa-b69f-8f0c7b3009a1",
        label: "Solskjerming",
        icon: "sun-shades",
      },
    ],
  },
  {
    id: "fellesbad",
    name: "Fellesbad",
    homeyZoneId: "8a6928ea-26b2-4922-9ead-d20ee6695dd3",
    temperatureDeviceId: "2529978e-3a0a-49b9-84e6-ad5a1f898f8b",
    primaryLightDeviceId: "2a9f0261-87ed-4c88-9804-bbc400b29519", // Taklys Fellesbad
  },
  {
    id: "gang",
    name: "Gang",
    homeyZoneId: "c36ba209-ab6b-4b2f-b9f3-a0dceb73ac89",
    temperatureDeviceId: "8de700de-8393-466f-8df5-a0926eb7800b",
    heatPumpDeviceId: "8de700de-8393-466f-8df5-a0926eb7800b", // Gang 2-3 etasje Varmepumpe (Daikin)
    primaryLightDeviceId: "dea615e5-4a22-48a4-b454-c2083a89f788", // 2etg Trappegang Taklys (group)
  },
];
