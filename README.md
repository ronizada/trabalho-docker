# Atividade Prática: Orquestração de Serviços com Docker Compose

## Integrantes
- Roni Herculano (Matrícula: 20221si028)

## Tema do Grupo
**Grupo 6 - Controle de Pedidos** (Entidades: Pedidos e Itens do Pedido)

## Descrição do Projeto
Aplicação web conteinerizada utilizando Docker Compose. A topologia inclui um banco de dados PostgreSQL persistido em volume, uma API em Python (FastAPI) e um servidor NGINX atuando como proxy reverso e servindo o frontend estático com interface industrial dark.

## Configuração de Ambiente (.env)
Por questões de segurança, as credenciais do banco de dados não são enviadas ao repositório. Siga os passos abaixo antes de iniciar:

1. Localize o arquivo `.env.example` na raiz do projeto.
2. Crie uma cópia deste arquivo e renomeie para `.env`.
3. Certifique-se de que as variáveis estejam configuradas (Exemplo):
   ```text
   DB_USER=postgres
   DB_PASSWORD=23839213812938
   DB_NAME=pedidos_db
   DB_HOST=db_pedidos