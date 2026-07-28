import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  useModal,
} from "@shared/ui";
import { useModalController } from "@shared/ui";
import { FC, useState } from "react";

const StackedModals: FC = () => {
  const modal = useModalController({
    list: {},
    create: {},
    confirm: {},
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={modal.modals.list.onOpen}>
        Open List
      </Button>

      <Modal
        open={modal.modals.list.open}
        onOpenChange={open => !open && modal.modals.list.onClose()}
      >
        <ModalContent
          size="md"
          title="Rules"
          description="Select or create a rule"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={modal.modals.list.onClose}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={modal.modals.create.onOpen}>
                Create Rule
              </Button>
            </>
          }
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">Rule list here...</p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        open={modal.modals.create.open}
        onOpenChange={open => !open && modal.modals.create.onClose()}
      >
        <ModalContent
          size="sm"
          title="Create Rule"
          description="Fill in the rule details"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={modal.modals.create.onClose}
              >
                Back
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={modal.modals.confirm.onOpen}
              >
                Delete
              </Button>
            </>
          }
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">Form fields here...</p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        open={modal.modals.confirm.open}
        onOpenChange={open => !open && modal.modals.confirm.onClose()}
      >
        <ModalContent
          size="sm"
          title="Delete rule?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          onConfirm={() => modal.closeAll()}
          onCancel={modal.modals.confirm.onClose}
        />
      </Modal>
    </div>
  );
};

const SuspendedModals: FC = () => {
  const modal = useModalController({
    list: {},
    create: { suspends: ["list"] },
    confirm: { suspends: ["create"] },
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="warning" onClick={modal.modals.list.onOpen}>
        Open List
      </Button>

      <Modal
        open={modal.modals.list.open}
        onOpenChange={open => !open && modal.modals.list.onClose()}
      >
        <ModalContent
          size="md"
          title="Rules"
          description="Select or create a rule"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={modal.modals.list.onClose}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={modal.modals.create.onOpen}>
                Create Rule
              </Button>
            </>
          }
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">Rule list here...</p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        open={modal.modals.create.open}
        onOpenChange={open => !open && modal.modals.create.onClose()}
      >
        <ModalContent
          size="sm"
          title="Create Rule"
          description="Fill in the rule details"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={modal.modals.create.onClose}
              >
                Back
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={modal.modals.confirm.onOpen}
              >
                Delete
              </Button>
            </>
          }
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">Form fields here...</p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        open={modal.modals.confirm.open}
        onOpenChange={open => !open && modal.modals.confirm.onClose()}
      >
        <ModalContent
          size="sm"
          title="Delete rule?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          onConfirm={() => modal.closeAll()}
          onCancel={modal.modals.confirm.onClose}
        />
      </Modal>
    </div>
  );
};

const ControlledModals: FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const modal = useModalController({
    list: { open, onOpenChange: setOpen },
    confirm: { open: confirmOpen, onOpenChange: setConfirmOpen },
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="info" onClick={() => setOpen(true)}>
        Open Controlled
      </Button>
      <span className="text-xs text-muted-foreground self-center">
        open={String(open)}, confirm={String(confirmOpen)}
      </span>

      <Modal
        open={modal.modals.list.open}
        onOpenChange={open => !open && setOpen(false)}
      >
        <ModalContent
          size="sm"
          title="Controlled List"
          description="Managed by external state"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmOpen(true)}
              >
                Delete
              </Button>
            </>
          }
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">
              Controlled by parent useState. Both modals stay open
              simultaneously.
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        open={modal.modals.confirm.open}
        onOpenChange={open => !open && setConfirmOpen(false)}
      >
        <ModalContent
          size="sm"
          title="Confirm Delete"
          description="Are you sure?"
          confirmLabel="Yes"
          confirmVariant="destructive"
          onConfirm={() => modal.closeAll()}
          onCancel={() => setConfirmOpen(false)}
        />
      </Modal>
    </div>
  );
};

export const ModalsSection: FC = () => {
  const modal = useModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Modal & Drawer</CardTitle>
        <CardDescription className="text-xs">
          Модальные окна и панели
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 flex-wrap">
        <Modal>
          <Modal.Trigger asChild>
            <Button size="sm">Default</Button>
          </Modal.Trigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Default Modal</ModalTitle>
              <ModalDescription>
                Standard modal with close on overlay
              </ModalDescription>
            </ModalHeader>
            <div className="px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Click outside or press ESC to close
              </p>
            </div>
            <ModalFooter>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button size="sm">Confirm</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal>
          <Modal.Trigger asChild>
            <Button size="sm" variant="secondary">
              No Close
            </Button>
          </Modal.Trigger>
          <ModalContent disableInteractOutside>
            <ModalHeader>
              <ModalTitle>Required Action</ModalTitle>
              <ModalDescription>
                Cannot be dismissed with overlay or ESC
              </ModalDescription>
            </ModalHeader>
            <div className="px-6 py-4">
              <p className="text-sm text-muted-foreground">
                This modal cannot be closed by clicking overlay or ESC key
              </p>
            </div>
            <ModalFooter>
              <Modal.Close asChild>
                <Button size="sm">Close</Button>
              </Modal.Close>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal>
          <Modal.Trigger asChild>
            <Button size="sm" variant="info">
              Scrollable
            </Button>
          </Modal.Trigger>
          <ModalContent size="lg">
            <ModalHeader>
              <ModalTitle>Long Content</ModalTitle>
              <ModalDescription>Scroll through the content</ModalDescription>
            </ModalHeader>
            <ModalBody className="space-y-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Paragraph {i + 1}.
                </p>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button size="sm">Confirm</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal>
          <Modal.Trigger asChild>
            <Button size="sm" variant="success">
              Top
            </Button>
          </Modal.Trigger>
          <ModalContent position="top" size="sm">
            <ModalHeader>
              <ModalTitle>Top Modal</ModalTitle>
              <ModalDescription>Positioned at the top</ModalDescription>
            </ModalHeader>
            <div className="px-6 py-4">
              <p className="text-sm text-muted-foreground">
                This modal slides from the top
              </p>
            </div>
            <ModalFooter>
              <Button size="sm">OK</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal>
          <Modal.Trigger asChild>
            <Button size="sm" variant="warning">
              Bottom
            </Button>
          </Modal.Trigger>
          <ModalContent position="bottom" size="sm">
            <ModalHeader>
              <ModalTitle>Bottom Modal</ModalTitle>
              <ModalDescription>Positioned at the bottom</ModalDescription>
            </ModalHeader>
            <div className="px-6 py-4">
              <p className="text-sm text-muted-foreground">
                This modal slides from the bottom
              </p>
            </div>
            <ModalFooter>
              <Button size="sm">OK</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal>
          <Modal.Trigger asChild>
            <Button size="sm" variant="destructive">
              Skeleton Delete
            </Button>
          </Modal.Trigger>
          <Modal.Content
            title="Delete item?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            confirmVariant="destructive"
            onConfirm={() => new Promise(res => setTimeout(res, 1000))}
            onCancel={() => {}}
          />
        </Modal>

        <Modal>
          <Modal.Trigger asChild>
            <Button size="sm" variant="primary">
              Skeleton with body
            </Button>
          </Modal.Trigger>
          <Modal.Content
            title="Edit profile"
            description="Update your account information."
            size="md"
            confirmLabel="Save"
            onConfirm={() => new Promise(res => setTimeout(res, 800))}
            onCancel={() => {}}
          >
            <p className="text-sm text-muted-foreground">
              Form fields would go here as children.
            </p>
          </Modal.Content>
        </Modal>

        <Button
          size="sm"
          variant="warning"
          onClick={() =>
            modal.openModal({
              title: "Publish changes?",
              description: "Your changes will be visible to all users.",
              confirmLabel: "Publish",
              confirmVariant: "warning",
              onConfirm: () => new Promise(res => setTimeout(res, 800)),
              onCancel: () => {},
            })
          }
        >
          Global skeleton
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            modal.openModal({
              size: "md",
              content: ({ onClose }) => (
                <>
                  <ModalHeader>
                    <ModalTitle>Custom Modal</ModalTitle>
                  </ModalHeader>
                  <ModalBody className="py-4">
                    <p className="text-sm text-muted-foreground">
                      Full control via render prop —{" "}
                      <code className="rounded bg-muted px-1">
                        content: ({"{ onClose }"}) =&gt; ...
                      </code>
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="outline" size="sm" onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              ),
            })
          }
        >
          Global render prop
        </Button>

        <Drawer>
          <Drawer.Trigger asChild>
            <Button variant="outline" size="sm">
              Default Drawer
            </Button>
          </Drawer.Trigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Default Drawer</DrawerTitle>
              <DrawerDescription>
                Swipe down or click outside to close
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Drawer content with smooth slide animation.
              </p>
            </div>
            <DrawerFooter>
              <Drawer.Close asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </Drawer.Close>
              <Button size="sm">Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <Drawer.Trigger asChild>
            <Button variant="outline" size="sm">
              Scrollable Drawer
            </Button>
          </Drawer.Trigger>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>Long Content</DrawerTitle>
              <DrawerDescription>Scrollable drawer content</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  Content item {i + 1}. Lorem ipsum dolor sit amet.
                </p>
              ))}
            </div>
            <DrawerFooter>
              <Drawer.Close asChild>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </Drawer.Close>
              <Button size="sm">Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardContent>

      <CardHeader className="pb-0">
        <CardTitle className="text-base">
          useModalController — stacked
        </CardTitle>
        <CardDescription className="text-xs">
          Все модалки открыты одновременно. Radix стакает оверлеи — для диалогов
          с одинаковым оверлеем. closeAll закрывает всю цепочку.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StackedModals />
      </CardContent>

      <CardHeader className="pb-0">
        <CardTitle className="text-base">
          useModalController — suspended
        </CardTitle>
        <CardDescription className="text-xs">
          suspends скрывает родительскую модалку при открытии дочерней. Подходит
          для drawer-ов или когда родитель должен быть виден за оверлеем.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SuspendedModals />
      </CardContent>

      <CardHeader className="pb-0">
        <CardTitle className="text-base">
          useModalController — controlled
        </CardTitle>
        <CardDescription className="text-xs">
          Управляется внешним useState. Обе модалки открыты одновременно.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ControlledModals />
      </CardContent>
    </Card>
  );
};
