/**
 * Data-driven room config for the 2nd-floor hallway dashboard.
 * Homey is source of truth for lights (via homeyZoneId) and capabilities.
 */
export const rooms = [
  {
    id: "adrian",
    name: "Adrian",
    homeyZoneId: "98942d58-6e30-40c8-ab6d-0f3d7919cef5",
    temperatureDeviceId: "641ce5ed-66b9-4ea9-bc61-9f70b74eb39e",
    // Prefer Hue bulbs over the separate Zigbee dimmer for color + dim control
    excludedLightDeviceIds: [
      "1e3c4b2c-539a-45dd-b873-b10d60af89f8",
      "6f6f9699-91c0-46d9-9642-8ab05fd9be3b",
    ],
    flows: [
      {
        id: "649d042a-4bf9-4a73-976b-ccced03b5a61",
        label: "Sovemodus",
        icon: "moon",
      },
    ],
  },
  {
    id: "fabian",
    name: "Fabian",
    homeyZoneId: "014b1a5d-6f62-49e0-b9d0-1b5b5c01e0b4",
    temperatureDeviceId: "1dc44f16-83d8-4897-b6ce-39345db80fec",
    excludedLightDeviceIds: [
      "1f130830-581d-43e4-ba67-5b1a4d2ec2bc",
      "8d468312-7022-4ee1-8359-6d175d6c6543",
    ],
    speakerDeviceId: "06d71bbf-5c0b-4aa6-a96a-cce4301fe916",
    flows: [
      {
        id: "4c0a1930-cdf3-489e-87d7-d14f3b62d419",
        label: "Sovemodus",
        icon: "moon",
      },
    ],
  },
  {
    id: "kontor",
    name: "Kontor",
    homeyZoneId: "5f67de23-2c24-4e71-8b75-da23ad4a8800",
    temperatureDeviceId: "f217627f-0d54-43a7-9d20-f88c99b25417",
  },
  {
    id: "hovedsoverom",
    name: "Hovedsoverom",
    homeyZoneId: "cc94f68d-30fb-482a-956b-2c551ccaf42c",
    temperatureDeviceId: "e5a8fd24-97f7-461b-bc4d-1014a1f85c89",
    excludedLightDeviceIds: ["1a1c7e48-f46a-4dfe-bb2e-ee9ba7d5c6e5"],
    flows: [
      {
        id: "4d989f8b-8983-48dd-be72-4aba6d59b3d9",
        label: "God morgen",
        icon: "sun",
      },
      {
        id: "7f8fc5da-5229-489b-99db-9825aba998bc",
        label: "Litt lys",
        icon: "lightbulb",
      },
    ],
  },
  {
    id: "fellesbad",
    name: "Fellesbad",
    homeyZoneId: "8a6928ea-26b2-4922-9ead-d20ee6695dd3",
    temperatureDeviceId: "2529978e-3a0a-49b9-84e6-ad5a1f898f8b",
  },
  {
    id: "gang",
    name: "Gang",
    homeyZoneId: "c36ba209-ab6b-4b2f-b9f3-a0dceb73ac89",
    temperatureDeviceId: "8de700de-8393-466f-8df5-a0926eb7800b",
    vacuumDeviceId: "6fbc8eb5-b864-4a13-9f79-e108398e4284",
  },
];
