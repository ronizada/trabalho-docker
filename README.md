# Atividade Prática: Orquestração de Serviços com Docker Compose

## Integrantes
- Roni Herculano (Matrícula: 20221si028)

## Tema do Grupo
**Grupo 6 - Controle de Pedidos** (Entidades: Pedidos e Itens do Pedido)

## Descrição do Projeto
Aplicação web conteinerizada utilizando Docker Compose. A topologia inclui um banco de dados PostgreSQL persistido em volume, uma API em Python (FastAPI) e um servidor NGINX atuando como proxy reverso e servindo o frontend estático.

## Instruções de Execução
Para subir a aplicação completa, navegue até a raiz do projeto e execute:

```bash
docker compose up --build -d