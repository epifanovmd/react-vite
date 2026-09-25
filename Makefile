# Деплой по SSH: исходники на хост и сборка образа там же. Настройки — .env.deploy
# (образец .env.deploy.example); адрес API для сервера — ENV_FILE (кладёт `make env`).
ifeq ($(wildcard .env.deploy),)
$(error Нет .env.deploy — скопируйте .env.deploy.example и заполните)
endif
include .env.deploy

SSH = ssh $(SSH_USER)@$(SSH_HOST)
REMOTE = cd $(SSH_PROJECT_DIR) && export APP_PORT=$(APP_PORT) && docker compose

.PHONY: deploy sync env build up down status logs restart

deploy: sync build up

sync:
	$(SSH) 'mkdir -p $(SSH_PROJECT_DIR)'
	rsync -az --delete --exclude-from=.deployignore ./ $(SSH_USER)@$(SSH_HOST):$(SSH_PROJECT_DIR)/

env:
	$(SSH) 'mkdir -p $(SSH_PROJECT_DIR)'
	scp $(ENV_FILE) $(SSH_USER)@$(SSH_HOST):$(SSH_PROJECT_DIR)/$(ENV_FILE)

build:
	$(SSH) '$(REMOTE) build'

up:
	$(SSH) '$(REMOTE) up -d --remove-orphans && docker image prune -f'

down:
	$(SSH) '$(REMOTE) down'

status:
	$(SSH) '$(REMOTE) ps'

logs:
	$(SSH) '$(REMOTE) logs -f --tail=200'

restart:
	$(SSH) '$(REMOTE) restart'
