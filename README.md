# Repertório Dibase

PWA de repertório para ensaios e shows. Funciona offline, no celular, sem depender de nenhum backend externo.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Produção

```bash
npm run build
npm start
```

## Railway

Crie um **projeto novo** no Railway, separado de qualquer outro aplicativo.

1. Conecte este repositório.
2. No serviço **web**, em **Settings → Build**, escolha o builder **Dockerfile**.
3. Em **Settings → Deploy**, no **Custom Start Command**, apague `npm start` e deixe `node server.mjs`.
4. Faça Redeploy.
5. Em **Networking**, gere o domínio público.

Não utilize a API da Alcateia. Uma API própria só deve ser criada no futuro, neste mesmo projeto.

## Dados

A primeira versão grava tudo no IndexedDB do dispositivo:

- 34 blocos
- músicas do repertório
- favoritos
- tons atuais
- setlists
