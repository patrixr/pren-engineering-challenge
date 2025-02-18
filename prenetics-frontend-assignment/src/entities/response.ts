export type ApiRecord<Attrs> = {
  id: string;
  type: string;
  attributes: Attrs;
  relationships: Record<string, ApiRecord<any>>
}

export type ApiDataResponse<Item> = {
  data: Item[],
};

export type ApiSearchResponse<Item extends ApiRecord<any>> = {
  meta: {
      total: number,
      page: number,
      pageSize: number,
      pageCount: number
  },
  included: ApiRecord<any>[]
} & ApiDataResponse<Item>