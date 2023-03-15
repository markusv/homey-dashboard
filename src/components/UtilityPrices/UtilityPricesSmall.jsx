import React from "react";
import { useGetUtilityPrices } from "../../helpers/useGetUtilityPrices";
import { getImageUrlSmall } from "./helpers/getImageUrlSmall";
import "./utilityPricess.css";
import { FocusedElement } from "../Focus/FocusedElement/FocusedElement";
import { UtilityPricesLarge } from "./UtilityPricesLarge";

export const UtilityPricesSmall = ({ onSetFocus, className }) => {
  const [utilityPrices] = useGetUtilityPrices();
  const imageData = getImageUrlSmall(utilityPrices);

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
    <div onClick={onUtilityClick} className={className}>
      {imageData && (
        <>
          <div>
            <span className="utility-price-header">Strømpris: </span>
            {new Date(imageData.start).getHours()} -{" "}
            {new Date(imageData.end).getHours()} nå:{" "}
            {imageData.priceNow.toFixed(2)} kr
          </div>
          <img
            className="utilityPriceChart"
            src={imageData.url}
            alt="utilityPriceChart"
          />
        </>
      )}
    </div>
  );
};
