#!/usr/bin/env node

const BASE_URL = process.env.VERIFY_BASE_URL || "http://localhost:3080";

const endpoints = [
  { path: "/", name: "Stue dashboard" },
  { path: "/entre", name: "Entre dashboard" },
  { path: "/api/read/temperature/loft", name: "Temperature API (loft)" },
];

const verify = async () => {
  let failed = 0;

  for (const endpoint of endpoints) {
    const url = `${BASE_URL}${endpoint.path}`;
    try {
      const response = await fetch(url, { redirect: "manual" });
      const ok = response.status === 200;
      const status = ok ? "OK" : "FAIL";
      console.log(`[${status}] ${response.status} ${endpoint.name} (${url})`);
      if (!ok) failed += 1;
    } catch (error) {
      console.log(`[FAIL] ${endpoint.name} (${url}): ${error.message}`);
      failed += 1;
    }
  }

  if (failed > 0) {
    console.error(
      `\nVerification failed: ${failed} endpoint(s) did not return 200.`
    );
    process.exit(1);
  }

  console.log("\nAll endpoints returned 200 OK.");
};

verify();
