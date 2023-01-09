import React, { useEffect, useState } from "react";
import { useGetUtilityPrices } from "../../helpers/useGetUtilityPrices";
import { getImageUrlSmall } from "./helpers/getImageUrlSmall";
import "./utilityPricess.css";
import { FocusedElement } from "../Focus/FocusedElement/FocusedElement";
import { UtilityPricesLarge } from "./UtilityPricesLarge";

export const UtilityPricesSmall = ({ onSetFocus }) => {
  const [utilityPrices] = useGetUtilityPrices();
  const [imageData, setImageData] = useState();

  useEffect(() => {
    const data = getImageUrlSmall(utilityPrices);
    if (data) setImageData(data);
  }, [utilityPrices]);

  const onUtilityClick = () => {
    onSetFocus({
      id: "utilityPrices",
      render: (close) => {
        return (
          <FocusedElement title="Strømpris" onCloseClick={close}>
            <UtilityPricesLarge utilityPrices={utilityPrices} />
          </FocusedElement>
        );
      },
    });
  };

  return (
    <div onClick={onUtilityClick}>
      {imageData && (
        <>
          <div>
            <span className="utility-price-header">Strømpris: </span>
            {new Date(imageData.start).getHours()} -{" "}
            {new Date(imageData.end).getHours()} gjnsnitt:{" "}
            {imageData.avgPrice / 100} kr
          </div>
          <img className="utilityPriceChart" src={imageData.url} />
        </>
      )}
    </div>
  );
};
