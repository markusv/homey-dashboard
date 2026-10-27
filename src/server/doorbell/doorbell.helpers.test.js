import { describe, expect, it } from "vitest";
import { getDoorbellSnapshotImage, isJpeg } from "./doorbell.helpers";

describe("getDoorbellSnapshotImage", () => {
  it("uses the camera snapshot on the doorbell", () => {
    expect(
      getDoorbellSnapshotImage({
        images: [
          {
            type: "camera",
            id: "main",
            imageObj: {
              id: "img-1",
              url: "/api/image/img-1",
            },
          },
        ],
      })
    ).toEqual({ id: "img-1", url: "/api/image/img-1" });
  });

  it("returns null when the doorbell has no snapshot", () => {
    expect(getDoorbellSnapshotImage({ images: [] })).toBeNull();
    expect(getDoorbellSnapshotImage(null)).toBeNull();
  });
});

describe("isJpeg", () => {
  it("accepts a JPEG magic header", () => {
    expect(isJpeg(Uint8Array.from([0xff, 0xd8, 0xff, 0xd9]))).toBe(true);
  });

  it("rejects Ring error payloads and empty files", () => {
    expect(isJpeg(Uint8Array.from([0x7b, 0x22, 0x65]))).toBe(false);
    expect(isJpeg(Uint8Array.from([0xff, 0xd8]))).toBe(false);
    expect(isJpeg(null)).toBe(false);
  });
});
