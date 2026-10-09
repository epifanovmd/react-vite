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
import { FC } from "react";

import type { ProvisionNodeAgentVM } from "../model/useProvisionNodeAgentVM";
import { InstallCommandPanel } from "./InstallCommandPanel";
import { NodeSshForm } from "./NodeSshForm";

interface ProvisionNodeAgentModalProps {
  vm: ProvisionNodeAgentVM;
}

const FORM_ID = "node-ssh-form";

const TEXT = {
  install: {
    title: "Установка агента",
    description: "Командой на узле или сервером по SSH",
    submit: "Установить",
    started:
      "Установка запущена. Узел выйдет на связь сам, как только агент запустится; ход — на карточке узла.",
  },
  uninstall: {
    title: "Удаление агента",
    description:
      "Сервер войдёт на узел по SSH, остановит службу и удалит программу агента",
    submit: "Удалить агента",
    started:
      "Удаление запущено. После него агент будет отозван, узел останется без агента.",
  },
} as const;

/** Установка или удаление агента узла; открывается методами VM. */
export const ProvisionNodeAgentModal: FC<ProvisionNodeAgentModalProps> =
  observer(({ vm }) => {
    const text = TEXT[vm.mode];
    const sshVisible = vm.mode === "uninstall" || vm.way === "ssh";

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
                vm.setWay(way === "ssh" ? "ssh" : "command")
              }
            >
              <TabsList>
                <TabsTrigger value="command">Команда</TabsTrigger>
                <TabsTrigger value="ssh">По SSH</TabsTrigger>
              </TabsList>
              <TabsContent value="command" className="pt-4">
                <InstallCommandPanel vm={vm} />
              </TabsContent>
              <TabsContent value="ssh" className="pt-4">
                <NodeSshForm vm={vm} formId={FORM_ID} />
              </TabsContent>
            </Tabs>
          )}
        </ModalContent>
      </Modal>
    );
  });
