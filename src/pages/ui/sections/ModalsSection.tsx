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
} from "@components/ui";
import { FC } from "react";

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
        {/* Default Modal */}
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

        {/* Modal with pulse on overlay click */}
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

        {/* Scrollable Modal */}
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

        {/* Top positioned modal */}
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

        {/* Bottom positioned modal */}
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

        {/* Skeleton props on Modal.Content directly */}
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

        {/* Global modal via useModal — skeleton props */}
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

        {/* Global modal — render prop for full control */}
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

        {/* Default Drawer */}
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

        {/* Scrollable drawer */}
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
    </Card>
  );
};
