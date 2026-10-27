import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchHomeyPath, getHomey } from "../homeyClient.js";
import { DOORBELL_DEVICE_ID } from "./doorbell.constants.js";
import { getDoorbellSnapshotImage, isJpeg } from "./doorbell.helpers.js";

const snapshotPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../data/doorbell.jpg"
);

const fail = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

export const getDoorbellSnapshotPath = () => snapshotPath;

export const readDoorbellSnapshot = async () => {
  try {
    const stat = await fs.stat(snapshotPath);
    return { path: snapshotPath, mtime: stat.mtime };
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};

export const captureDoorbellSnapshot = async () => {
  const homey = await getHomey();
  const device = await homey.devices.getDevice({ id: DOORBELL_DEVICE_ID });
  const image = getDoorbellSnapshotImage(device);

  if (!image) {
    throw fail("no_snapshot", "Doorbell has no snapshot");
  }

  const response = await fetchHomeyPath(image.url);
  if (!response.ok) {
    throw fail(
      "homey_image_failed",
      `Homey image request failed with ${response.status}`
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (!isJpeg(bytes)) {
    throw fail("not_jpeg", "Homey snapshot was not a JPEG");
  }

  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
  const tempPath = `${snapshotPath}.tmp`;
  await fs.writeFile(tempPath, bytes);
  await fs.rename(tempPath, snapshotPath);

  return {
    bytes: bytes.length,
    capturedAt: new Date().toISOString(),
  };
};
