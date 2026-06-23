import { SessionDto } from "@api/api-gen/data-contracts";
import { computed, makeObservable } from "mobx";

import { DataModelBase } from "../DataModelBase";
import { DateModel } from "../date";

export class SessionModel extends DataModelBase<SessionDto> {
  public readonly lastActiveDate = new DateModel(() => this.data.lastActiveAt);
  public readonly createdAtDate = new DateModel(() => this.data.createdAt);

  constructor(data: SessionDto) {
    super(data);
    makeObservable(this, {
      id: computed,
      deviceLabel: computed,
      ip: computed,
      lastActive: computed,
      createdAt: computed,
    });
  }

  get id() {
    return this.data.id;
  }

  get deviceLabel() {
    return (
      this.data.deviceName ??
      this.data.deviceType ??
      "Неизвестное устройство"
    );
  }

  get ip() {
    return this.data.ip ?? "—";
  }

  get lastActive() {
    return this.lastActiveDate.formattedDiff;
  }

  get createdAt() {
    return this.createdAtDate.formattedDate;
  }
}
