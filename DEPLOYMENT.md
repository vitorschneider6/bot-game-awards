Implantação com Docker em uma instância AWS EC2

Pré-requisitos
- Uma instância AWS EC2 (recomenda-se Amazon Linux 2 ou Ubuntu) com Docker e Docker Compose instalados.
- Um arquivo `.env` na raiz do projeto com as variáveis de ambiente necessárias (veja `.env.example`).

Passos rápidos (na instância EC2)

1. Clone o repositório e entre na pasta do projeto

```bash
git clone <repo-url> app
cd app
```

2. Crie o arquivo `.env` a partir de `.env.example` e preencha os valores (especialmente `BOT_TOKEN` e as credenciais do banco de dados)

3. Inicie com o docker-compose

```bash
docker compose up -d --build
```

Observações e dicas
- O processo Node do repositório executa tanto o bot do Discord quanto a API Express no mesmo contêiner.
- Este `docker-compose.yml` não cria mais um container MySQL por padrão; use o Amazon RDS (ou outro banco externo) e
  configure `DB_HOST`, `DB_USER`, `DB_PASS` e `DB_NAME` no seu `.env` para apontar para o RDS.
- Verifique o grupo de segurança da sua instância EC2 para garantir acesso de saída ao gateway do Discord e, se desejar
  que a API seja pública, abra a porta `3000` para entrada.
- Para ver os logs:

```bash
docker compose logs -f app
```

- Para atualizar a aplicação após alterações no código, refaça o build e reinicie:

```bash
docker compose pull
docker compose up -d --build
```

````
