export function mongo(databaseId: string): {
  find<T = any>(options: {
    collection: string;
    filter?: any;
    project?: any;
    sort?: any;
    limit?: number;
    skip?: number;
  }): T[];

  findOne<T = any>(options: {
    collection: string;
    filter?: any;
    project?: any;
    sort?: any;
    skip?: number;
  }): T;
};

export const pageState: {
  callMethod(blockId: any, method: any, callArgs?: any[]): Promise<any>;
  getProperty(...keys: string[]): Promise<any>;
};
