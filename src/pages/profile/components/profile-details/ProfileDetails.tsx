import { InfoField } from "@components/ui";
import { FC } from "react";

import { ProfileDetailsProps } from "./ProfileDetails.types";

export const ProfileDetails: FC<ProfileDetailsProps> = ({ fields }) => (
  <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
    {fields.map(field => (
      <InfoField key={field.label} {...field} className="bg-card" />
    ))}
  </div>
);
