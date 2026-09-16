import React, { Suspense } from "react";
import { useGetFavoritees } from "./hooks/useGetFavoritees";
import { SONOS_KITCHEN_ID } from "./Sonos";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { FavoritesSkeleton } from "./FavoritesSkeleton";
import "./sonos.css";

const SonosFavoritesList = ({ onFavoriteClick, deviceId }) => {
  const { favorites } = useGetFavoritees(deviceId);
  return (
    <div className="sonos-favorites-container">
      {favorites?.map((favorite) => (
        <div
          key={favorite.id}
          className="sonos-favorites"
          onClick={() => {
            onFavoriteClick(favorite);
          }}
        >
          {favorite.image ? (
            <img
              src={favorite.image}
              className="sonos-favorites-image"
              alt=""
              width="100"
              height="100"
            />
          ) : (
            <span className="sonos-favorites-image" aria-hidden />
          )}
          <span className="sonos-favorites-name">{favorite.name}</span>
        </div>
      ))}
    </div>
  );
};

export const SonosFavorites = ({
  close,
  onFavoriteClick,
  deviceId = SONOS_KITCHEN_ID,
  embedded = false,
}) => {
  const list = (
    <Suspense fallback={<FavoritesSkeleton />}>
      <SonosFavoritesList
        deviceId={deviceId}
        onFavoriteClick={onFavoriteClick}
      />
    </Suspense>
  );
  if (embedded) {
    return list;
  }
  return (
    <FocusedElement title="Sonos Favoritter" onCloseClick={close}>
      {list}
    </FocusedElement>
  );
};
