export interface GameBoardTypes {
  results: number;
  colors: string;
}

export interface StatisticsTypes {
  result: string;
  count: number;
  color: string;
}

export interface LogsTypes {
  uuid: string;
  id: number;
  startTime: Date;
  startDelta: number;
  startDeltaUs: number;
  fakeStartDelta: number;
  duration: number;
  result?: number;
  outcome?: string;
}
