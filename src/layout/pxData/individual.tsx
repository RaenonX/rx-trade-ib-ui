import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {PxDataChart} from '../../components/chart/pxData/main';
import {PeriodTimer} from '../../components/periodTimer/main';
import {TimeAgo} from '../../components/timeAgo/main';
import {PositionData} from '../../types/position';
import {PxData} from '../../types/pxData';
import styles from './individual.module.scss';


type Props = {
  pxData: PxData,
  position: PositionData | undefined,
};

export const PriceDataIndividual = ({pxData, position}: Props) => {
  const [lastUpdated, setLastUpdated] = React.useState(Date.now());
  const updateIndicatorRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (updateIndicatorRef.current) {
      // Trigger animation
      updateIndicatorRef.current.style.animation = 'none';
      updateIndicatorRef.current.offsetHeight;
      updateIndicatorRef.current.style.animation = '';
    }
  }, [lastUpdated]);

  React.useEffect(() => {
    setLastUpdated(Date.now());
  }, [pxData]);

  return (
    <div>
      <Row className="g-0 mb-2">
        <Col>
          <h3>{pxData.contract.symbol}</h3>
        </Col>
        <Col xs="auto">
          <PeriodTimer periodMs={60000}/>
        </Col>
      </Row>
      <Row className="g-0 mb-2">
        <Col>
          <PxDataChart
            chartData={pxData}
            position={position}
            height={700}
          />
        </Col>
      </Row>
      <Row className="g-0 text-end">
        <Col>
          <TimeAgo
            ref={updateIndicatorRef}
            epochSec={lastUpdated}
            format={(secDiffMs) => `Last updated ${secDiffMs.toFixed(0)} secs ago`}
            updateMs={100}
            className={styles['update-animation']}
          />
        </Col>
      </Row>
    </div>
  );
};
