## Tools and references

Referência para padronização de mensagens de commit.
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

Ferramenta de lint para mensagens de commits.
[Git-commit-msg-linter](https://www.npmjs.com/package/git-commit-msg-linter)

Referência sobre disponibilidade das features do nodejs
[Node.green](https://node.green/)

Guia para usar eslint + ts + airbnb style guide
[Typescript eslint](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md)

Hooks de pre-commit, pre-push e etc
[Husky](https://github.com/typicode/husky)
Roda somente em arquivos que estão na staged area
[Lint staged](https://github.com/okonet/lint-staged#readme)

## Camadas da aplicação

### Presentation
Camada responsável por validadar os dados, chamar a implementação devida e preparar a resposta para o cliente

### Data
Camada que contém a implementação dos protocolos definidos na camada Domain.

### Domain
Camada que contém somente protocolos(interfaces) referente as **regras de negócio**
OBS: Não deve ter implementação de lógica nessa camada, apenas interfaces e contratos.
