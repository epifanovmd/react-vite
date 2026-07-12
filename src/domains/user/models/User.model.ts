import { UserDto } from "@api/gen/model";
import { DataModelBase } from "@models";
import { DateModel } from "@models/date";
import { computed, makeObservable } from "mobx";

export class UserModel extends DataModelBase<UserDto> {
  public readonly createdAtDate = new DateModel(() => this.data.createdAt);
  public readonly updatedAtDate = new DateModel(() => this.data.updatedAt);
  public readonly lastOnlineDate = new DateModel(
    () => this.data.profile?.lastOnline,
  );

  constructor(data: UserDto) {
    super(data);
    makeObservable(this, {
      displayName: computed,
      initials: computed,
      login: computed,
      emailVerified: computed,
      createdAt: computed,
      updatedAt: computed,
      lastOnline: computed,
    });
  }

  get displayName() {
    const p = this.data.profile;
    const name = [p?.firstName, p?.lastName].filter(Boolean).join(" ");

    return name || this.data.email || this.data.phone || "Unknown";
  }

  get initials() {
    const p = this.data.profile;
    const parts = [p?.firstName, p?.lastName].filter(Boolean);

    if (parts.length > 0)
      return parts
        .map(s => s![0])
        .join("")
        .toUpperCase();

    return (this.data.email?.[0] ?? "U").toUpperCase();
  }

  get login() {
    return this.data.email ?? this.data.phone;
  }

  get emailVerified() {
    return this.data.emailVerified;
  }

  get createdAt() {
    return this.createdAtDate.formattedDate;
  }

  get updatedAt() {
    return this.updatedAtDate.formattedDate;
  }

  get lastOnline() {
    return this.lastOnlineDate.data
      ? this.lastOnlineDate.formattedDate
      : undefined;
  }
}
