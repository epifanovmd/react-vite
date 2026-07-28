import { SessionDto } from "@shared/api/gen/model";
import { DataModelBase } from "@shared/lib/models";
import { DateModel } from "@shared/lib/models/date";
import { computed, makeObservable } from "mobx";

export class SessionModel extends DataModelBase<SessionDto> {
  public readonly lastActiveAtDate = new DateModel(
    () => this.data.lastActiveAt,
  );
  public readonly createdAtDate = new DateModel(() => this.data.createdAt);

  constructor(data: SessionDto) {
    super(data);
    makeObservable(this, {
      deviceName: computed,
    });
  }

  get deviceName() {
    return this.data.deviceName ?? "Unknown device";
  }
}
