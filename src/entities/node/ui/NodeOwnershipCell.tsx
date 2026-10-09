import { FC } from "react";

interface NodeOwnershipCellProps {
  /** Имя владельца. */
  owner: string | null;
  /** Имя создателя; совпадает с владельцем или неизвестен — не показывается. */
  creator: string | null;
}

/** Кому принадлежит узел: владелец и, если другой, — создатель. */
export const NodeOwnershipCell: FC<NodeOwnershipCellProps> = ({
  owner,
  creator,
}) => (
  <div className="min-w-0 text-xs">
    <p className={owner ? "truncate" : "truncate text-muted-foreground"}>
      {owner ?? "не назначен"}
    </p>
    {creator && creator !== owner && (
      <p className="truncate text-muted-foreground">создал {creator}</p>
    )}
  </div>
);
