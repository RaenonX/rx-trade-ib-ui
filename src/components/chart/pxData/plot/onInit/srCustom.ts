import {ISeriesApi} from 'lightweight-charts';

import {OnPxChartInitEvent} from '../../type';
import {srLevelCustom, srLevelLineStyle, srLevelLineWidthStrong} from '../const';


export const handleSrCustom = (e: OnPxChartInitEvent, price: ISeriesApi<'Candlestick'>) => {
  const {customSrLevels} = e;

  if (!customSrLevels) {
    return;
  }

  customSrLevels.forEach(({
    level,
    strong,
  }) => {
    price.createPriceLine({
      price: level,
      axisLabelVisible: true,
      title: strong ? '!' : '',
      color: srLevelCustom,
      lineWidth: srLevelLineWidthStrong,
      lineStyle: srLevelLineStyle,
      lineVisible: true,
    });
  });
};
