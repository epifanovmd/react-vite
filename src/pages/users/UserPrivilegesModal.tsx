import {
  KnownPermission,
  TPermission,
  TRole,
  UserDto,
} from "@api/api-gen/data-contracts";
import {
  AsyncButton,
  Button,
  Field,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Select,
} from "@components/ui";
import { useNotification } from "@core/notifications";
import { useUsersDataStore } from "@store";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";

const PERMISSION_OPTIONS = Object.values(KnownPermission).map(value => ({
  value,
  label: value,
}));

interface UserPrivilegesModalProps {
  open: boolean;
  user: UserDto;
  onClose: () => void;
  onSaved?: () => void;
}

export const UserPrivilegesModal: FC<UserPrivilegesModalProps> = observer(
  ({ open, user, onClose, onSaved }) => {
    const store = useUsersDataStore();
    const toast = useNotification();

    const [roles, setRoles] = useState<string[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
      if (open) {
        store.loadRoles();
        setRoles(user.roles.map(r => String(r.name)));
        setPermissions(user.directPermissions.map(p => String(p.name)));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, user]);

    const handleSave = async () => {
      const res = await store.setPrivileges(user.id, {
        roles: roles as TRole[],
        permissions: permissions as TPermission[],
      });

      if (res.error) {
        toast.error(res.error.message);

        return;
      }

      toast.success("Права доступа обновлены");
      onSaved?.();
      onClose();
    };

    return (
      <Modal open={open} onOpenChange={o => !o && onClose()}>
        <ModalOverlay />
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>Права доступа</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4 my-2">
              <Field label="Роли" description="Заменяют текущие роли пользователя">
                <Select
                  multi
                  value={roles}
                  onChange={setRoles}
                  options={store.roleOptions}
                  loading={store.rolesHolder.isLoading}
                  placeholder="Выберите роли"
                  search
                />
              </Field>

              <Field
                label="Прямые разрешения"
                description="Дополняют разрешения ролей"
              >
                <Select
                  multi
                  value={permissions}
                  onChange={setPermissions}
                  options={PERMISSION_OPTIONS}
                  placeholder="Выберите разрешения"
                  search
                />
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <AsyncButton onClick={handleSave}>Сохранить</AsyncButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
);
