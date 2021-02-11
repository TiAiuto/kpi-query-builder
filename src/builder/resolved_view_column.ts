export type ResolvedViewColumnArgs = {
  publicName: string;
  physicalName: string;
};

export class ResolvedViewColumn {
  publicName: string;
  physicalName: string;

  constructor({ publicName, physicalName }: ResolvedViewColumnArgs) {
    this.publicName = publicName;
    this.physicalName = physicalName;
  }
}
