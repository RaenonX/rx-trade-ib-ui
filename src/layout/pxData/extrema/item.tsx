import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {ButtonVariant} from 'react-bootstrap/types';

import {PxDataExtrema, PxDataExtremaDataKey} from '../../../types/pxData';
import {PxExtremaCDF} from './cdf/main';


type Props = {
  icon: React.ReactNode,
  data: PxDataExtrema,
  dataKey: PxDataExtremaDataKey,
  decimals: number,
  suffix?: string,
};

export const PxExtremaItem = ({icon, dataKey, data, decimals, suffix}: Props) => {
  const {val, pct} = data.current[dataKey];
  const [show, setShow] = React.useState(false);

  let variant: ButtonVariant;
  if (pct > 60) {
    variant = 'outline-success';
  } else if (pct > 30) {
    variant = 'outline-warning';
  } else {
    variant = 'outline-danger';
  }

  return (
    <>
      <Modal show={show} size="xl" centered onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>CDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PxExtremaCDF
            data={data[dataKey]}
            currentSide={data.current.swing.val > 0 ? 'pos' : 'neg'}
            currentPct={pct}
            decimals={dataKey === 'duration' ? 0 : 2}
            reverseOnNegative={dataKey === 'swing'}
          />
        </Modal.Body>
      </Modal>
      <Button size="sm" variant={variant} onClick={() => setShow(true)}>
        {icon}&nbsp;
        {`${val.toFixed(decimals)}${suffix || ''} (${pct.toFixed(2)}%)`}
      </Button>
    </>
  );
};
