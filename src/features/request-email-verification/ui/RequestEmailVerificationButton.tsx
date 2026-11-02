import { Button } from "@shared/ui";
import { MailCheck } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useRequestEmailVerification } from "../model/useRequestEmailVerification";

export const RequestEmailVerificationButton: FC = observer(() => {
  const { isLoading, requestVerification } = useRequestEmailVerification();

  return (
    <Button
      size="sm"
      variant="outline"
      loading={isLoading}
      leftIcon={<MailCheck size={14} />}
      onClick={requestVerification}
    >
      Подтвердить
    </Button>
  );
});
