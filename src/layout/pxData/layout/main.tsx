import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {pxDataDispatchers} from '../../../state/pxData/dispatchers';
import {usePxDataSelector} from '../../../state/pxData/selector';
import {PxDataDispatcherName} from '../../../state/pxData/types';
import {useDispatch} from '../../../state/store';
import {PxData} from '../../../types/pxData';
import {SocketContext} from '../../socket/socket';
import {PriceDataIndividual} from './individual';


export const PriceDataMain = () => {
  const socket = React.useContext(SocketContext);
  const dispatch = useDispatch();
  const pxData = usePxDataSelector();

  if (!socket) {
    return <>Not Connected</>;
  }

  const onPxUpdated = (message: string) => {
    const pxData: PxData = JSON.parse(message);

    dispatch(pxDataDispatchers[PxDataDispatcherName.UPDATE](pxData));
  };

  React.useEffect(() => {
    socket.on('pxUpdated', onPxUpdated);

    return () => {
      socket.off('pxUpdated', onPxUpdated);
    };
  }, []);

  return (
    <>
      {Object.values(pxData).map((data) => (
        <Row key={data.uniqueIdentifier} className="mb-3 g-0">
          <Col>
            <PriceDataIndividual data={data}/>
          </Col>
        </Row>
      ))}
    </>
  );
};
