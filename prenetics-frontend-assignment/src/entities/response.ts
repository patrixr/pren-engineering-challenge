export type ApiRecord<Attrs> = {
  id: string;
  type: string;
  attributes: Attrs;
  relationships?: Record<string, {
    data: {
      id: string,
      type: string,
    }
  }>
}

export type ApiDataResponse<Item> = {
  data: Item,
};

export type ApiSearchResponse<Item> = {
  meta: {
      total: number,
      page: number,
      pageSize: number,
      pageCount: number
  },
  included: ApiRecord<any>[]
} & ApiDataResponse<Item>