import {PxChartUpdatedEventHandler} from '../../type';
import {handleAvgCost} from './cost';
import {handleEma120} from './ema';
import {handleMarkers} from './marker/main';
import {handleOpenOrder} from './openOrder';
import {handleOrderEntry} from './orderEntry';
import {handlePrice} from './price';
import {handleSR} from './sr';
import {handleVwap} from './vwap';


export const onPxChartUpdated: PxChartUpdatedEventHandler = (e) => {
  handlePrice(e);
  handleVwap(e);
  handleEma120(e);
  handleSR(e);
  handleAvgCost(e);
  handleOpenOrder(e);
  handleMarkers(e);
  handleOrderEntry(e);
};
