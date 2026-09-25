import type { EPrivacyLevel } from "@shared/api/gen/main/model";
import { Segmented, Skeleton, Spinner } from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import {
  PRIVACY_FIELDS,
  PRIVACY_LEVEL_OPTIONS,
  useEditPrivacy,
} from "../model/useEditPrivacy";

/** Кто видит аватар, телефон и время последнего визита. */
export const PrivacySettings: FC = observer(() => {
  const { privacy, saving, change } = useEditPrivacy();

  if (!privacy) return <Skeleton className="h-28 w-full" />;

  return (
    <div className="flex flex-col divide-y divide-border">
      {PRIVACY_FIELDS.map(field => (
        <div
          key={field.key}
          className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="flex items-center gap-2 text-sm text-foreground">
            {field.label}
            {saving === field.key && <Spinner size="sm" />}
          </span>
          <Segmented<EPrivacyLevel>
            size="sm"
            options={PRIVACY_LEVEL_OPTIONS}
            value={privacy[field.key]}
            disabled={saving !== null}
            onValueChange={value => change(field.key, value)}
          />
        </div>
      ))}
    </div>
  );
});
