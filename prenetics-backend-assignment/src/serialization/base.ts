export interface SerializedRecord<Attrs = {}> {
  type: string;
  id: string;
  attributes?: Partial<Attrs>;
}
