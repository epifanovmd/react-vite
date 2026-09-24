import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Drawer,
  DrawerBody,
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

import {
  ConfirmDemo,
  ControlledModals,
  StackedModals,
  SuspendedModals,
} from "./modals";

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

const LONG_PARAGRAPHS = Array.from({ length: 20 }, (_, i) => i + 1);

export const ModalsSection = () => {
  const modal = useModal();

  const openGlobalSkeleton = () =>
    modal.openModal({
      title: "Опубликовать изменения?",
      description: "Изменения увидят все пользователи.",
      confirmLabel: "Опубликовать",
      confirmVariant: "warning",
      onConfirm: () => wait(800),
      onCancel: () => {},
    });

  const openGlobalRenderProp = () =>
    modal.openModal({
      size: "md",
      content: ({ onClose }) => (
        <>
          <ModalHeader>
            <ModalTitle>Произвольное окно</ModalTitle>
          </ModalHeader>
          <ModalBody className="py-4">
            <p className="text-sm text-muted-foreground">
              Полный контроль через render prop —{" "}
              <code className="rounded bg-muted px-1">
                content: ({"{ onClose }"}) =&gt; …
              </code>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="sm" onClick={onClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </>
      ),
    });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modal</CardTitle>
          <CardDescription className="text-xs">
            Составное окно, режим подтверждения и глобальный ModalProvider
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Modal>
            <Modal.Trigger asChild>
              <Button size="sm">Обычное</Button>
            </Modal.Trigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Обычное окно</ModalTitle>
                <ModalDescription>
                  Закрывается по клику вне окна и по ESC
                </ModalDescription>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  Кликните снаружи или нажмите ESC
                </p>
              </ModalBody>
              <ModalFooter>
                <Modal.Close asChild>
                  <Button variant="outline" size="sm">
                    Отмена
                  </Button>
                </Modal.Close>
                <Modal.Close asChild>
                  <Button size="sm">Готово</Button>
                </Modal.Close>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal>
            <Modal.Trigger asChild>
              <Button size="sm" variant="secondary">
                Без закрытия снаружи
              </Button>
            </Modal.Trigger>
            <ModalContent disableInteractOutside>
              <ModalHeader>
                <ModalTitle>Обязательное действие</ModalTitle>
                <ModalDescription>
                  Не закрывается кликом вне окна и по ESC
                </ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <Modal.Close asChild>
                  <Button size="sm">Закрыть</Button>
                </Modal.Close>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal>
            <Modal.Trigger asChild>
              <Button size="sm" variant="info">
                С прокруткой
              </Button>
            </Modal.Trigger>
            <ModalContent size="lg">
              <ModalHeader>
                <ModalTitle>Длинное содержимое</ModalTitle>
                <ModalDescription>Тело окна прокручивается</ModalDescription>
              </ModalHeader>
              <ModalBody className="space-y-4">
                {LONG_PARAGRAPHS.map(i => (
                  <p key={i} className="text-sm text-muted-foreground">
                    Абзац {i}. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                ))}
              </ModalBody>
              <ModalFooter>
                <Modal.Close asChild>
                  <Button size="sm">Закрыть</Button>
                </Modal.Close>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal>
            <Modal.Trigger asChild>
              <Button size="sm" variant="success">
                Сверху
              </Button>
            </Modal.Trigger>
            <ModalContent
              position="top"
              size="sm"
              title="Окно сверху"
              description="Выезжает от верхнего края"
            />
          </Modal>

          <Modal>
            <Modal.Trigger asChild>
              <Button size="sm" variant="warning">
                Снизу
              </Button>
            </Modal.Trigger>
            <ModalContent
              position="bottom"
              size="sm"
              title="Окно снизу"
              description="Выезжает от нижнего края"
            />
          </Modal>

          <Modal>
            <Modal.Trigger asChild>
              <Button size="sm" variant="destructive">
                Подтверждение
              </Button>
            </Modal.Trigger>
            <Modal.Content
              title="Удалить элемент?"
              description="Это действие нельзя отменить."
              confirmLabel="Удалить"
              confirmVariant="destructive"
              onConfirm={() => wait(1000)}
              onCancel={() => {}}
            />
          </Modal>

          <Modal>
            <Modal.Trigger asChild>
              <Button size="sm" variant="primary">
                Подтверждение с телом
              </Button>
            </Modal.Trigger>
            <Modal.Content
              title="Редактирование профиля"
              description="Обновите данные аккаунта."
              size="md"
              confirmLabel="Сохранить"
              onConfirm={() => wait(800)}
              onCancel={() => {}}
            >
              <p className="text-sm text-muted-foreground">
                Здесь могли бы быть поля формы.
              </p>
            </Modal.Content>
          </Modal>

          <Button size="sm" variant="warning" onClick={openGlobalSkeleton}>
            Глобальное окно
          </Button>

          <Button size="sm" variant="secondary" onClick={openGlobalRenderProp}>
            Глобальное с render prop
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">useConfirm</CardTitle>
          <CardDescription className="text-xs">
            Промис разрешается true после подтверждения и false при любом
            закрытии, включая closeAll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Drawer</CardTitle>
          <CardDescription className="text-xs">
            Панель на vaul: направление, ручка свайпа у вертикальных, тело с
            прокруткой
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Drawer>
            <Drawer.Trigger asChild>
              <Button variant="outline" size="sm">
                Снизу
              </Button>
            </Drawer.Trigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Панель снизу</DrawerTitle>
                <DrawerDescription>
                  Потяните вниз или кликните снаружи, чтобы закрыть
                </DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                <p className="text-sm text-muted-foreground">
                  Содержимое панели.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Drawer.Close asChild>
                  <Button variant="outline" size="sm">
                    Отмена
                  </Button>
                </Drawer.Close>
                <Button size="sm">Отправить</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Drawer>
            <Drawer.Trigger asChild>
              <Button variant="outline" size="sm">
                С прокруткой
              </Button>
            </Drawer.Trigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Длинное содержимое</DrawerTitle>
                <DrawerDescription>DrawerBody прокручивается</DrawerDescription>
              </DrawerHeader>
              <DrawerBody className="space-y-4">
                {LONG_PARAGRAPHS.map(i => (
                  <p key={i} className="text-sm text-muted-foreground">
                    Элемент {i}. Lorem ipsum dolor sit amet.
                  </p>
                ))}
              </DrawerBody>
              <DrawerFooter>
                <Drawer.Close asChild>
                  <Button variant="outline" size="sm">
                    Закрыть
                  </Button>
                </Drawer.Close>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Drawer direction="top">
            <Drawer.Trigger asChild>
              <Button variant="outline" size="sm">
                Сверху
              </Button>
            </Drawer.Trigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Панель сверху</DrawerTitle>
                <DrawerDescription>Ручка снизу</DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                <p className="text-sm text-muted-foreground">
                  Уведомление или быстрые действия.
                </p>
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          <Drawer direction="left">
            <Drawer.Trigger asChild>
              <Button variant="outline" size="sm">
                Слева
              </Button>
            </Drawer.Trigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Навигация</DrawerTitle>
                <DrawerDescription>Боковая панель без ручки</DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                <p className="text-sm text-muted-foreground">Пункты меню…</p>
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          <Drawer direction="right">
            <Drawer.Trigger asChild>
              <Button variant="outline" size="sm">
                Справа
              </Button>
            </Drawer.Trigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Детали</DrawerTitle>
                <DrawerDescription>Боковая панель справа</DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                <p className="text-sm text-muted-foreground">
                  Карточка объекта…
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Drawer.Close asChild>
                  <Button variant="outline" size="sm">
                    Закрыть
                  </Button>
                </Drawer.Close>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">useModalController — стек</CardTitle>
          <CardDescription className="text-xs">
            Все окна открыты одновременно, Radix стакает оверлеи. closeAll
            закрывает всю цепочку.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StackedModals />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            useModalController — suspends
          </CardTitle>
          <CardDescription className="text-xs">
            suspends скрывает родительское окно, пока открыто дочернее.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuspendedModals />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            useModalController — управляемый
          </CardTitle>
          <CardDescription className="text-xs">
            Состояние во внешнем useState, оба окна открыты одновременно.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ControlledModals />
        </CardContent>
      </Card>
    </div>
  );
};
