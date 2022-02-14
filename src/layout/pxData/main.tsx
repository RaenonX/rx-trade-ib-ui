import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {executionDispatchers} from '../../state/execution/dispatchers';
import {useExecutionSelector} from '../../state/execution/selector';
import {ExecutionDispatcherName} from '../../state/execution/types';
import {openOrderDispatchers} from '../../state/openOrder/dispatchers';
import {useOpenOrderSelector} from '../../state/openOrder/selector';
import {OpenOrderDispatcherName} from '../../state/openOrder/types';
import {positionDispatchers} from '../../state/position/dispatchers';
import {usePositionSelector} from '../../state/position/selector';
import {PositionDispatcherName} from '../../state/position/types';
import {pxDataDispatchers} from '../../state/pxData/dispatchers';
import {usePxDataSelector} from '../../state/pxData/selector';
import {PxDataDispatcherName} from '../../state/pxData/types';
import {useDispatch} from '../../state/store';
import {Execution} from '../../types/execution';
import {OpenOrder} from '../../types/openOrder';
import {Position} from '../../types/position';
import {PxData} from '../../types/pxData';
import {PxDataMarket} from '../../types/pxDataMarket';
import {SocketContext} from '../socket/socket';
import {PriceDataIndividual} from './individual';


export const PriceDataMain = () => {
  const socket = React.useContext(SocketContext);
  const dispatch = useDispatch();
  const pxData = usePxDataSelector();
  const position = usePositionSelector();
  const openOrder = useOpenOrderSelector();
  const execution = useExecutionSelector();

  if (!socket) {
    return <>Not Connected</>;
  }

  const onPxUpdated = (message: string) => {
    const pxData: PxData = JSON.parse(message);

    dispatch(pxDataDispatchers[PxDataDispatcherName.UPDATE](pxData));
    socket.emit('position', '');
    socket.emit('openOrder', '');
    socket.emit('execution', '');
  };

  const onPxUpdatedMarket = (message: string) => {
    const data: PxDataMarket = JSON.parse(message);

    dispatch(pxDataDispatchers[PxDataDispatcherName.UPDATE_MARKET](data));
  };

  const onPosition = (message: string) => {
    const data: Position = JSON.parse(message);

    dispatch(positionDispatchers[PositionDispatcherName.UPDATE](data));
  };

  const onOpenOrder = (message: string) => {
    const data: OpenOrder = JSON.parse(message);

    dispatch(openOrderDispatchers[OpenOrderDispatcherName.UPDATE](data));
  };

  const onExecution = (message: string) => {
    const data: Execution = JSON.parse(message);

    dispatch(executionDispatchers[ExecutionDispatcherName.UPDATE](data));
  };

  const onPxInit = (message: string) => {
    const data: PxData[] = JSON.parse(message);

    dispatch(pxDataDispatchers[PxDataDispatcherName.INIT](data));
  };

  React.useEffect(() => {
    socket.on('pxUpdated', onPxUpdated);
    socket.on('pxUpdatedMarket', onPxUpdatedMarket);
    socket.on('pxInit', onPxInit);
    socket.on('position', onPosition);
    socket.on('openOrder', onOpenOrder);
    socket.on('execution', onExecution);

    socket.emit('pxInit', '');

    return () => {
      socket.off('pxUpdated', onPxUpdated);
      socket.off('pxUpdatedMarket', onPxUpdatedMarket);
      socket.off('pxInit', onPxInit);
      socket.off('position', onPosition);
      socket.off('openOrder', onOpenOrder);
      socket.on('execution', onExecution);
    };
  }, []);

  return (
    <Row className="mb-3 g-3">
      {Object.values(pxData).map((data) => (
        <Col key={data.uniqueIdentifier} xs={6}>
          <PriceDataIndividual
            pxData={data}
            payload={{
              position: position[data.uniqueIdentifier],
              openOrder: openOrder[data.uniqueIdentifier],
              execution: execution[data.uniqueIdentifier],
            }}
          />
        </Col>
      ))}
    </Row>
  );
};
