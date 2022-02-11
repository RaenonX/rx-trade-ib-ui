import {BarPrice, BarPrices, ISeriesApi} from 'lightweight-charts';

import {OnPxChartInitEvent} from '../type';


export const handleLegendUpdate = (
  e: OnPxChartInitEvent,
  vwap: ISeriesApi<'Line'>,
  price: ISeriesApi<'Candlestick'>,
) => {
  const {chartRef, chartDataRef, setObject} = e;

  if (!chartRef.current) {
    throw new Error('Legend to be handled while the chart is not ready');
  }

  const last = chartDataRef.current.data.at(-1);

  chartRef.current.subscribeCrosshairMove(({seriesPrices}) => {
    const vwapPrice = seriesPrices.get(vwap) as BarPrice | undefined;
    const lastPrice = seriesPrices.get(price) as BarPrices | undefined;

    setObject.legend((legend) => ({
      ...legend,
      vwap: vwapPrice || last?.vwap || NaN,
      close: lastPrice?.close || last?.close || NaN,
    }));
  });
};