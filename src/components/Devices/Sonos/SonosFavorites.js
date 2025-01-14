import { useGetFavoritees } from "./hooks/useGetFavoritees";
import { SONOS_KITCHEN_ID } from "./Sonos";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import "./sonos.css";

export const SonosFavorites = ({ close, onFavoriteClick }) => {
  const { loading, favorites } = useGetFavoritees(SONOS_KITCHEN_ID);
  if (loading) {
    return <div className="sonos-favorites-loading">Loading...</div>;
  }
  return (
    <FocusedElement title="Sonos Favoritter" onCloseClick={close}>
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
    </FocusedElement>
  );
};
