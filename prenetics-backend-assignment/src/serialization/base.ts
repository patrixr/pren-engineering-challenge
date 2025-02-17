export type SerializedRecord<Attrs = {}> = {
  type: string;
  id: string;
  attributes?: Partial<Attrs>;
};
