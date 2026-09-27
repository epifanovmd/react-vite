import { PublicUserDto } from "@shared/api/gen/main/model";
import { DataModelBase } from "@shared/lib/models";
import { DateModel } from "@shared/lib/models/date";
import { computed, makeObservable } from "mobx";

export class PublicUserModel extends DataModelBase<PublicUserDto> {
  public readonly lastOnlineDate = new DateModel(
    () => this.data.profile?.lastOnline,
  );

  constructor(data: PublicUserDto) {
    super(data);
    makeObservable(this, {
      id: computed,
      displayName: computed,
      initials: computed,
      lastOnline: computed,
    });
  }

  get id() {
    return this.data.userId;
  }

  get displayName() {
    const p = this.data.profile;
    const name = [p?.firstName, p?.lastName].filter(Boolean).join(" ");

    return name || this.data.username || "Unknown";
  }

  get initials() {
    const p = this.data.profile;
    const parts = [p?.firstName, p?.lastName].filter(Boolean);

    if (parts.length > 0)
      return parts
        .map(s => s![0])
        .join("")
        .toUpperCase();

    return (this.data.username?.[0] ?? "U").toUpperCase();
  }

  get lastOnline() {
    return this.lastOnlineDate.data
      ? this.lastOnlineDate.formattedDate
      : undefined;
  }
}
