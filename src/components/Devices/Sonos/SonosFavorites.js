import { useGetFavoritees } from "./hooks/useGetFavoritees";
import { SONOS_KITCHEN_ID } from "./Sonos";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import "./sonos.css";

export const SonosFavorites = ({
  close,
  onFavoriteClick,
  deviceId = SONOS_KITCHEN_ID,
  embedded = false,
}) => {
  const { loading, favorites } = useGetFavoritees(deviceId);
  if (loading) {
    return <div className="sonos-favorites-loading">Laster…</div>;
  }
  const list = (
    <div className="sonos-favorites-container">
      {favorites?.map((f) => {
        return (
          <div
            key={f.id}
            className="sonos-favorites"
            onClick={() => {
              onFavoriteClick(f);
            }}
          >
            <img src={f.image} className="sonos-favorites-image" />
            {f.name}
          </div>
        );
      })}
    </div>
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
