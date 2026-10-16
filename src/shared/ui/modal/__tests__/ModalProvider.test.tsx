import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import { useConfirm } from "../hooks/use-confirm";
import { useModal } from "../hooks/use-modal";
import { ModalProvider } from "../provider/ModalProvider";

let lastResult: Promise<boolean> | null = null;

const Harness = ({ onClose }: { onClose?: () => void }) => {
  const confirm = useConfirm();
  const modal = useModal();

  const ask = () => {
    lastResult = confirm({ title: "Удалить запись?" });
  };

  const openPlain = () => {
    modal.openModal({ title: "Обычное окно", onClose });
  };

  return (
    <>
      <button type="button" onClick={ask}>
        спросить
      </button>
      <button type="button" onClick={openPlain}>
        открыть
      </button>
      <button type="button" onClick={modal.closeAll}>
        закрыть все
      </button>
    </>
  );
};

const renderHarness = (onClose?: () => void) =>
  render(
    <ModalProvider>
      <Harness onClose={onClose} />
    </ModalProvider>,
  );

describe("ModalProvider.confirm", () => {
  beforeEach(() => {
    lastResult = null;
  });

  it("resolves true after confirming", async () => {
    renderHarness();

    fireEvent.click(screen.getByText("спросить"));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Подтвердить" }));
    });

    await expect(lastResult).resolves.toBe(true);
  });

  it("resolves false after cancelling", async () => {
    renderHarness();

    fireEvent.click(screen.getByText("спросить"));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
    });

    await expect(lastResult).resolves.toBe(false);
  });

  it("resolves false when the modal is closed by closeAll", async () => {
    renderHarness();

    fireEvent.click(screen.getByText("спросить"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("закрыть все"));
    });

    await expect(lastResult).resolves.toBe(false);
  });

  it("calls options.onClose exactly once per closed modal", async () => {
    const onClose = vi.fn();

    renderHarness(onClose);

    fireEvent.click(screen.getByText("открыть"));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    });

    await act(async () => {
      fireEvent.click(screen.getByText("закрыть все"));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

const SyncHarness = ({ onClose }: { onClose: () => void }) => {
  const modal = useModal();

  const openAndClose = () => {
    const id = modal.openModal({ title: "Мгновенное окно", onClose });

    modal.closeModal(id);
  };

  const openAndCloseTwice = () => {
    const id = modal.openModal({ title: "Дважды", onClose });

    modal.closeModal(id);
    modal.closeModal(id);
  };

  return (
    <>
      <button type="button" onClick={openAndClose}>
        открыть и закрыть
      </button>
      <button type="button" onClick={openAndCloseTwice}>
        закрыть дважды
      </button>
    </>
  );
};

describe("ModalProvider.closeModal в одном обработчике", () => {
  it("закрывает окно, открытое в том же обработчике", () => {
    const onClose = vi.fn();

    render(
      <ModalProvider>
        <SyncHarness onClose={onClose} />
      </ModalProvider>,
    );

    fireEvent.click(screen.getByText("открыть и закрыть"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("повторный closeModal не вызывает onClose второй раз", () => {
    const onClose = vi.fn();

    render(
      <ModalProvider>
        <SyncHarness onClose={onClose} />
      </ModalProvider>,
    );

    fireEvent.click(screen.getByText("закрыть дважды"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
