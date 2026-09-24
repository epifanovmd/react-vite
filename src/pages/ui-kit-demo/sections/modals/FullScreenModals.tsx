import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@shared/ui";

const PARAGRAPHS = Array.from({ length: 16 }, (_, i) => i + 1);

export const FullScreenModals = () => (
  <div className="flex flex-wrap gap-2">
    <Modal>
      <Modal.Trigger asChild>
        <Button size="sm">На весь экран на мобильном</Button>
      </Modal.Trigger>
      <ModalContent size="lg" fullScreenOnMobile>
        <ModalHeader>
          <ModalTitle>Редактирование профиля</ModalTitle>
          <ModalDescription>
            Уже sm окно занимает весь экран, тело прокручивается
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {PARAGRAPHS.map(i => (
            <p key={i} className="text-sm text-muted-foreground">
              Абзац {i}. На телефоне окно без скруглений и рамки, отступы
              учитывают вырез экрана и системные панели (safe-area).
            </p>
          ))}
        </ModalBody>
        <ModalFooter>
          <Modal.Close asChild>
            <Button variant="outline" size="sm">
              Отмена
            </Button>
          </Modal.Close>
          <Modal.Close asChild>
            <Button size="sm">Сохранить</Button>
          </Modal.Close>
        </ModalFooter>
      </ModalContent>
    </Modal>

    <Modal>
      <Modal.Trigger asChild>
        <Button size="sm" variant="secondary">
          size=&quot;full&quot;
        </Button>
      </Modal.Trigger>
      <ModalContent
        size="full"
        title="Почти весь экран"
        description="Отступ 1rem со всех сторон на любой ширине"
      >
        <p className="text-sm text-muted-foreground">
          Подходит для редакторов и больших таблиц.
        </p>
      </ModalContent>
    </Modal>
  </div>
);
