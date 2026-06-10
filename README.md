# 🅿️ Sistema de Gestão de Estacionamento

> Aplicação web moderna para gerenciamento de vagas de estacionamento, desenvolvida com React 19, TypeScript e Vite.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?style=flat-square)

---

## 📋 Sobre o Projeto

Este projeto é um sistema de gestão de estacionamento que permite controlar a entrada e saída de veículos, monitorar a ocupação das vagas em tempo real e gerar informações sobre o fluxo de veículos.

---

## 🚀 Funcionalidades

- ✅ Controle de entrada e saída de veículos
- ✅ Visualização em tempo real das vagas disponíveis e ocupadas
- ✅ Gerenciamento de estado global com Zustand
- ✅ Interface moderna e responsiva com TailwindCSS v4
- ✅ Ícones com Lucide React

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia       | Versão  | Finalidade                    |
|------------------|---------|-------------------------------|
| React            | ^19.2   | Biblioteca de UI              |
| TypeScript       | ~6.0    | Tipagem estática              |
| Vite             | ^8.0    | Build tool e dev server       |
| TailwindCSS      | ^4.3    | Estilização utilitária        |
| Zustand          | ^5.0    | Gerenciamento de estado       |
| Lucide React     | ^1.17   | Ícones SVG                    |

---

## 📦 Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/estacionamento.git

# 2. Entre na pasta do projeto
cd Projeto_2/estacionamento

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🧰 Scripts Disponíveis

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Gera o build de produção
npm run preview   # Visualiza o build de produção localmente
npm run lint      # Executa o linter (ESLint)
```

---

## 📁 Estrutura do Projeto

```
Projeto_2/
└── estacionamento/
    ├── public/              # Arquivos públicos estáticos
    ├── src/
    │   ├── assets/          # Imagens e recursos
    │   ├── components/      # Componentes React reutilizáveis
    │   ├── store/           # Gerenciamento de estado (Zustand)
    │   ├── App.tsx          # Componente raiz
    │   ├── main.tsx         # Ponto de entrada da aplicação
    │   └── index.css        # Estilos globais
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## 👤 Autor

**Rodrigo Volpi**

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
