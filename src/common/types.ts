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
  startDelta: number;
  fakeStartDelta: number;
  result?: number;
  outcome?: string;
}
