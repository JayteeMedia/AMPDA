export type Id = string;

export type ISODateString = string;

export interface Entity {

  id: Id;

  createdAt: ISODateString;

  updatedAt: ISODateString;

}
