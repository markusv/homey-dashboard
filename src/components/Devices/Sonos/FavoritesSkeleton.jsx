import React from "react";
import "./sonos.css";

const SKELETON_TILE_COUNT = 8;
const skeletonTiles = Array.from(
  { length: SKELETON_TILE_COUNT },
  (_, index) => index
);

export const FavoritesSkeleton = () => (
  <div
    className="sonos-favorites-container"
    aria-busy="true"
    aria-label="Laster"
  >
    {skeletonTiles.map((index) => (
      <div key={index} className="sonos-favorites" aria-hidden>
        <span className="sonos-favorites-image sonos-favorites-skeleton-block" />
        <span className="sonos-favorites-skeleton-name" />
      </div>
    ))}
  </div>
);
