import { Join } from "./join";

export class RawJoin extends Join {
  raw: string;

  constructor({ raw }: { raw: string }) {
    super({ type: "raw" });
    this.raw = raw;
  }
}
