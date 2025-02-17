import { Result } from '../entity/result';
import { formatDate } from '../utils/formats';
import { SerializedRecord } from './base';

type SerializedResult = SerializedRecord<{
  result: any;
  sampleId: string;
  resultType: string;
  activateTime: string;
  resultTime: string;
}>;

const aliases: Record<string, string> = {
  type: 'resultType',
};

const formatters: Record<string, (value: any) => any> = {
  activateTime: formatDate,
  resultTime: formatDate,
};

export function serializeResult(
  result: Result,
  include: string[] = [],
): SerializedResult {
  const record: SerializedResult = {
    id: result.resultId,
    type: 'sample',
  };

  if (include.length) {
    record.attributes = include.reduce(
      (acc, key) => {
        if (key in result) {
          acc[aliases[key] ?? key] = formatters[key]
            ? formatters[key](result[key as keyof Result])
            : result[key as keyof Result];
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  return record;
}
