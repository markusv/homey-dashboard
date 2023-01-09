import React, { useEffect, useState } from "react";
import { getImageUrlLarge } from "./helpers/getImageUrlLarge";

export const UtilityPricesLarge = ({ utilityPrices }) => {
  const [imageData, setImageData] = useState();

  useEffect(() => {
    const data = getImageUrlLarge(utilityPrices);
    if (data) setImageData(data);
  }, [utilityPrices]);

  return (
    <div>
      {imageData && (
        <>
          <div className="utility-prices-details">
            <span>
              Strømpris: {new Date(imageData.start).getHours()} -{" "}
              {new Date(imageData.end).getHours()}
            </span>
            <span>{`gjnsnitt: ${imageData.avgPrice / 100} kr`}</span>
            <span>{`min: ${imageData.minPrice / 100} kr`}</span>
            <span>{`max: ${imageData.maxPrice / 100} kr`}</span>
          </div>
          <img className="utilityPriceChartLarge" src={imageData.url} />
        </>
      )}
    </div>
  );
};
