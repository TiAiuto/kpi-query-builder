export abstract class View {
  type: string;
  name: string;
  alphabetName: string;

  constructor({
    type,
    name,
    alphabetName,
  }: {
    type: string;
    name: string;
    alphabetName: string;
  }) {
    this.type = type;
    this.name = name;
    this.alphabetName = alphabetName;
  }
}
