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
2. Build: `npm ci && npm run build`
3. Start: `npm start`
4. A URL pública ficará no estilo `https://repertorio-dibase-production.up.railway.app`

Não utilize a API da Alcateia. Uma API própria só deve ser criada no futuro, neste mesmo projeto.

## Dados

A primeira versão grava tudo no IndexedDB do dispositivo:

- 34 blocos
- músicas do repertório
- favoritos
- tons atuais
- setlists
