import { PublicColumnInterface } from "./public_column_interface";

export type ResolvedViewColumnArgs = {
  publicName: string;
  physicalName: string;
};

// TODO: ここの命名改善できそう。。
export class ResolvedViewColumn implements PublicColumnInterface {
  publicName: string;
  physicalName: string;

  constructor({
    publicName,
    physicalName,
  }: ResolvedViewColumnArgs) {
    this.publicName = publicName;
    this.physicalName = physicalName;
  }
}