import React from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {useSocket} from '../../../hooks/socket/main';
import {openOrderDispatchers} from '../../../state/openOrder/dispatchers';
import {OpenOrderDispatcherName} from '../../../state/openOrder/types';
import {useDispatch} from '../../../state/store';
import {SecurityIdentifier} from '../../../types/common';
import {TimeAgo} from '../../timeAgo/main';
import {OrderPanel} from '../orderPanel/main';
import {OrderPanelState} from '../orderPanel/type';
import {PeriodTimer} from '../periodTimer/main';
import {useTradingViewChart} from './hook';
import styles from './main.module.scss';
import {
  ChartCalcObjects,
  ChartDataUpdatedEventHandler,
  ChartInitEventHandler,
  ChartRenderObjects,
} from './type';


export type TradingViewChartProps<T, P, R, L, A> = {
  height: number,
  initChart: ChartInitEventHandler<T, R, L, A>,
  chartData: T,
  payload: P,
  onDataUpdated: ChartDataUpdatedEventHandler<T, P, R, L, A>,
  calcObjects: ChartCalcObjects<T, L>,
  renderObjects: ChartRenderObjects<T, L>,
  renderLayoutConfig: (config: A, setConfig: (newConfig: A) => void) => React.ReactNode,
  getIdentifier: (data: T) => SecurityIdentifier,
  getPnLMultiplier: (data: T) => number,
  getPeriodSec: (data: T) => number,
  getInitialLayoutConfig: (data: T) => A,
};

export const TradingViewChart = <T, P, R, L, A>({
  height,
  initChart,
  calcObjects,
  chartData,
  payload,
  onDataUpdated,
  renderObjects,
  renderLayoutConfig,
  getIdentifier,
  getPnLMultiplier,
  getPeriodSec,
  getInitialLayoutConfig,
}: TradingViewChartProps<T, P, R, L, A>) => {
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const chartDataRef = React.useRef<T>(chartData);
  const updateIndicatorRef = React.useRef<HTMLSpanElement>(null);
  const [lastUpdated, setLastUpdated] = React.useState(Date.now());
  const [legend, setLegend] = React.useState<L>(calcObjects.legend(chartData));
  const [order, setOrder] = React.useState<OrderPanelState>(calcObjects.order(chartData));
  const [layoutConfig, setLayoutConfig] = React.useState<A>(getInitialLayoutConfig(chartData));
  const dispatch = useDispatch();
  const socket = useSocket();

  const periodSec = getPeriodSec(chartData);

  const setObject = {
    legend: setLegend,
    order: setOrder,
  };

  const onDataUpdatedInternal = () => {
    chartDataRef.current = chartData;
    onDataUpdated({chartRef, chartDataRef, chartObjectRef, setObject, payload, order, layoutConfig});
  };

  const onLoad = () => {
    if (!chartContainerRef.current) {
      return;
    }

    chartDataRef.current = chartData;
    makeChart({
      chartDataRef,
      setObject,
      layoutConfig,
      chartContainer: chartContainerRef.current,
    });
  };

  const onOrderPanelShowChanged = () => {
    dispatch(openOrderDispatchers[OpenOrderDispatcherName.SET_POLL](!order.show));
    socket.emit('openOrder', ''); // Ensure the open order data is up-to-date
  };

  const onChartDataUpdated = () => {
    setLastUpdated(Date.now());
    if (updateIndicatorRef.current) {
      // Trigger animation
      updateIndicatorRef.current.style.animation = 'none';
      updateIndicatorRef.current.offsetHeight;
      updateIndicatorRef.current.style.animation = '';
    }
  };

  const {makeChart, chartRef, chartObjectRef} = useTradingViewChart({
    initChart,
    onDataUpdated: onDataUpdatedInternal,
  });

  React.useEffect(onLoad, []);
  React.useEffect(
    onDataUpdatedInternal,
    [chartObjectRef.current?.initData, chartData, payload, order, layoutConfig],
  );
  React.useEffect(onOrderPanelShowChanged, [order.show]);
  React.useEffect(onChartDataUpdated, [chartData]);

  return (
    <>
      {
        order.show &&
        <OrderPanel
          state={order}
          setState={setOrder}
          identifier={getIdentifier(chartData)}
          multiplier={getPnLMultiplier(chartData)}
        />
      }
      <div className="mb-2" style={{height}} ref={chartContainerRef}>
        <div className={styles['legend']}>
          {renderObjects.legend(chartData, legend)}
        </div>
      </div>
      <Row className="g-2 align-items-center">
        <Col>
          {renderLayoutConfig(layoutConfig, setLayoutConfig)}
          <Button size="sm" variant="outline-success" className="me-2" onClick={() => {
            chartRef.current?.timeScale().scrollToRealTime();
          }}>
            To Realtime
          </Button>
          <Button size="sm" variant="outline-warning" onClick={() => {
            chartRef.current?.timeScale().resetTimeScale();
            chartRef.current?.priceScale().applyOptions({autoScale: true});
          }}>
            Reset Scales
          </Button>
        </Col>
        <Col xs="auto">
          <PeriodTimer periodSec={periodSec}/>
        </Col>
        <Col xs="auto" className="text-end">
          <TimeAgo
            ref={updateIndicatorRef}
            epochSec={lastUpdated}
            format={(secDiffMs) => `Last updated ${secDiffMs.toFixed(0)} secs ago`}
            updateMs={100}
            className={styles['update-animation']}
          />
        </Col>
      </Row>
    </>
  );
};
