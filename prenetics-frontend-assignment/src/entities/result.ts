import { ApiRecord } from "./response";

export type Result = ApiRecord<{
  result: string;
  sampleId: string;
  resultType: string;
  activateTime: string;
  resultTime: string;
}> 
