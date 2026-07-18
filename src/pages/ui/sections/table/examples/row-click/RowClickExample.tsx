import {
  Button,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Table,
} from "@components/ui";
import type { FC } from "react";

import { ExampleCard, OrderDetails } from "../../shared";
import { useRowClickExample } from "./useRowClickExample";

export const RowClickExample: FC = () => {
  const { data, columns, activeOrder, onRowClick, closeDetails } =
    useRowClickExample();

  return (
    <ExampleCard
      title="Клик по строке"
      description="onRowClick — открывает модалку с деталями заказа."
    >
      <Table data={data} columns={columns} size="sm" onRowClick={onRowClick} />

      <Modal
        open={!!activeOrder}
        onOpenChange={open => !open && closeDetails()}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Заказ {activeOrder?.id}</ModalTitle>
            <ModalDescription>Подробная информация о заказе</ModalDescription>
          </ModalHeader>
          {activeOrder && <OrderDetails order={activeOrder} />}
          <ModalFooter>
            <Button onClick={closeDetails}>Закрыть</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ExampleCard>
  );
};
