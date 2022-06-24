
const formatMarketPrice = (priceData: any) => {
  let price: any = {};
  if (!priceData) {
    return;
  }

  price.topBuy = priceData.buy;
  price.topSell = priceData.sell;
  price.high24hr = priceData['24hoursHigh'];
  price.low24hr = priceData['24hoursLow'];
  return price;
}

const coinNameFormat = (coin: any) => {
  return (coin.tradeTypeFullName as string).split('-')[0]
}

export { formatMarketPrice, coinNameFormat };
