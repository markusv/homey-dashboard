// Angi hvor mange timer bakover og fremover fra inneværende time den skal bruke
const TIMER_BAKOVER = 3;
const TIMER_FREMOVER = 21;

// Angi størrelsen på grafen
const GRAPH_WIDTH = 500;
const GRAPH_HEIGHT = 260;

export const getImageUrlSmall = (allPrices) => {
  if (!allPrices) {
    return null;
  }

  console.log("getImageUrlSmall: allPrices: ", allPrices);
  // Date-objekt for akkurat denne timen
  let d = new Date();
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0); //

  // Loop for å finne array-key for inneværende time
  let iNow, iStart, iEnd, dLoop;
  for (let i = 0; i < allPrices.length; i++) {
    dLoop = new Date(allPrices[i].startsAt);
    if (d.getTime() == dLoop.getTime()) {
      iNow = i;
      iStart = iNow - TIMER_BAKOVER;
      if (iStart < 0) {
        iStart = 0;
      }
      iEnd = iNow + TIMER_FREMOVER;
      if (iEnd > allPrices.length) {
        iEnd = allPrices.length - 1;
      }
      break;
    }
  }

  // Loop for å finne snittpris
  let avgPrice = 0;
  let minPrice = 100000;
  let maxPrice = 0;
  let prices = [];
  let colors = [];
  let pointsize = [];

  // Finn neste midnatt
  d.setHours(0);
  d.setDate(d.getDate() + 1);

  console.log(`iStart: ${iStart} iEnd: ${iEnd}`);
  for (let i = iStart; i <= iEnd; i++) {
    avgPrice += allPrices[i].price;
    prices.push(Math.round(allPrices[i].price * 100));

    if (allPrices[i].price * 100 < minPrice)
      minPrice = Math.round(allPrices[i].price * 100);
    if (allPrices[i].price * 100 > maxPrice)
      maxPrice = Math.round(allPrices[i].price * 100);

    if (i == iNow) {
      colors.push("'yellow'");
      pointsize.push(6);
    } else if (d.getTime() == new Date(allPrices[i].startsAt).getTime()) {
      colors.push("'cyan'");
      pointsize.push(0);
    } else {
      colors.push("'cyan'");
      pointsize.push(0);
    }
  }
  avgPrice = Math.round((avgPrice / prices.length) * 100);

  // Loop for å lage strek for snittprisen
  let dTemp;
  let avgPrices = [];
  let labels = [];
  for (let i = iStart; i <= iEnd; i++) {
    avgPrices.push(avgPrice);
    dTemp = new Date(allPrices[i].startsAt);
    let hours = dTemp.getHours();
    if (hours < 10) hours = "0" + hours;
    labels.push("'" + hours + "'");
  }

  let url =
    "https://quickchart.io/chart?w=" +
    GRAPH_WIDTH +
    "&h=" +
    GRAPH_HEIGHT +
    "&devicePixelRatio=1.0&c=";
  url += encodeURI(
    "{ \
   type:'line', \
   data:{ \
      labels:[ \
         " +
      labels +
      " \
      ], \
      datasets:[ \
         { \
            label:'Øre pr kWh', \
            steppedLine:true, \
            data:[ \
               " +
      prices +
      " \
            ], \
            fill:false, \
            borderColor:'rgb(39,186,253)', \
            borderWidth: 2, \
            pointBackgroundColor:[ \
               " +
      colors +
      " \
            ], \
            pointRadius:[ \
               " +
      pointsize +
      " \
            ] \
         }, \
         { \
            label:'Snitt (" +
      avgPrice +
      " øre)', \
            data:[ \
               " +
      avgPrices +
      " \
            ], \
            fill:false, \
            borderColor:'rgb(244,50,48)', \
            borderWidth: 2, \
            pointRadius: 0 \
         } \
      ] \
   }, \
   options:{ \
      legend:false, \
      scales:{ \
        yAxes:[ \
            { \
               ticks:{ \
                  display: false ,\
                  beginAtZero:false, \
               } \
            } \
         ], \
         xAxes:[ \
            { \
               ticks:{ \
                  display: false ,\
               } \
            } \
         ] \
      } \
   } \
}"
  );
  return {
    url,
    start: allPrices[iStart].startsAt,
    end: allPrices[iEnd].startsAt,
    avgPrice: avgPrices[0],
  };
};
