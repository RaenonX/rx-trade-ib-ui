import {SecurityIdentifier} from './common';


export type PxDataBar = {
  epochSec: number,
  amplitudeHL: number,
  amplitudeOC: number,
  open: number,
  high: number,
  low: number,
  close: number,
  vwap: number,
};

export type PxDataContract = {
  symbol: string,
  minTick: number,
  multiplier: number,
};

export type PxDataSupportResistance = {
  level: number,
  type: {
    window: boolean,
    fractal: boolean,
  },
};

export type PxData = {
  uniqueIdentifier: number,
  contract: PxDataContract,
  data: PxDataBar[],
  supportResistance: PxDataSupportResistance[],
};

export type PxDataCollection = {
  [identifier: SecurityIdentifier]: PxData,
};
