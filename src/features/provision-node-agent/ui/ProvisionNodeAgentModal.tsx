import {
  Alert,
  Button,
  Modal,
  ModalContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/ui";
import { Link } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { FC, ReactNode } from "react";

import type { ProvisionNodeAgentVM } from "../model/useProvisionNodeAgentVM";
import { InstallCommandPanel } from "./InstallCommandPanel";
import { NodeSshForm } from "./NodeSshForm";

interface ProvisionNodeAgentModalProps {
  vm: ProvisionNodeAgentVM;
  /** Вкладка «Архив»: выдача архива агента узла (её собирает страница). */
  archive?: ReactNode;
}

const FORM_ID = "node-ssh-form";

const TEXT = {
  install: {
    title: "Установка агента",
    description: "Командой на узле, архивом для получателя или сервером по SSH",
    submit: "Установить",
    started:
      "Установка запущена. Узел выйдет на связь сам, как только агент запустится; ход — на карточке узла.",
  },
  uninstall: {
    title: "Удаление агента",
    description:
      "Сервер войдёт на узел по SSH, остановит агента и удалит его программу",
    submit: "Удалить агента",
    started:
      "Удаление запущено. После него агент будет отозван, узел останется без агента.",
  },
} as const;

/** Установка или удаление агента узла; открывается методами VM. */
export const ProvisionNodeAgentModal: FC<ProvisionNodeAgentModalProps> =
  observer(({ vm, archive }) => {
    const text = TEXT[vm.mode];
    const sshVisible = vm.mode === "uninstall" || vm.way === "ssh";
    const ways = ["command", ...(archive ? ["archive"] : []), "ssh"];

    return (
      <Modal open={vm.node !== null} onOpenChange={open => !open && vm.close()}>
        <ModalContent
          size="lg"
          fullScreenOnMobile
          title={`${text.title}: ${vm.node?.name ?? ""}`}
          description={text.description}
          footer={
            vm.jobId || !sshVisible ? (
              <>
                <Button variant="outline" onClick={vm.close}>
                  Закрыть
                </Button>
                {vm.jobId && (
                  <Button asChild>
                    <Link to="/jobs">К задачам</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={vm.close}>
                  Отмена
                </Button>
                <Button
                  type="submit"
                  form={FORM_ID}
                  variant={vm.mode === "uninstall" ? "destructive" : "primary"}
                  loading={vm.sshForm.formState.isSubmitting}
                >
                  {text.submit}
                </Button>
              </>
            )
          }
        >
          {vm.jobId ? (
            <Alert variant="success">{text.started}</Alert>
          ) : vm.mode === "uninstall" ? (
            <NodeSshForm vm={vm} formId={FORM_ID} />
          ) : (
            <Tabs
              value={vm.way}
              onValueChange={way =>
                vm.setWay(
                  ways.includes(way) ? (way as typeof vm.way) : "command",
                )
              }
            >
              <TabsList>
                <TabsTrigger value="command">Команда</TabsTrigger>
                {archive && <TabsTrigger value="archive">Архив</TabsTrigger>}
                <TabsTrigger value="ssh">По SSH</TabsTrigger>
              </TabsList>
              <TabsContent value="command" className="pt-4">
                <InstallCommandPanel vm={vm} />
              </TabsContent>
              {archive && (
                <TabsContent value="archive" className="pt-4">
                  {archive}
                </TabsContent>
              )}
              <TabsContent value="ssh" className="pt-4">
                <NodeSshForm vm={vm} formId={FORM_ID} />
              </TabsContent>
            </Tabs>
          )}
        </ModalContent>
      </Modal>
    );
  });
