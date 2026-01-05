# 🎮 LiraGames - Homepage

Página inicial profissional para a plataforma LiraGames, construída com Node.js e Express.

## 🚀 Características

- ✨ Design moderno e profissional
- 🎨 Tema escuro com glassmorphism
- 🌈 Gradientes vibrantes e animações suaves
- 📱 Totalmente responsivo
- ⚡ Performance otimizada
- 🎯 SEO-friendly

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Navegue até o diretório do projeto:
```bash
cd e:\06_WebMaster\09_LiraGames\liragames
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Executar

### Modo de Desenvolvimento/Produção

```bash
npm start
```

ou

```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
liragames/
├── server.js           # Servidor Express
├── package.json        # Configurações e dependências
├── README.md          # Documentação
└── public/            # Arquivos estáticos
    ├── index.html     # Página principal
    ├── styles.css     # Estilos
    └── script.js      # JavaScript interativo
```

## 🎨 Seções da Página

1. **Hero Section** - Apresentação principal com estatísticas
2. **Sobre** - Missão, visão e valores
3. **Recursos** - Funcionalidades da plataforma
4. **Contato** - Informações de contato

## 🌐 Deploy

Para fazer deploy em seu servidor de hospedagem:

1. Faça upload de todos os arquivos para o servidor
2. Execute `npm install` no servidor
3. Configure a porta (padrão: 3000) através da variável de ambiente `PORT`
4. Inicie o servidor com `npm start`

### Variáveis de Ambiente

- `PORT` - Porta do servidor (padrão: 3000)

Exemplo:
```bash
PORT=8080 npm start
```

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **HTML5** - Estrutura
- **CSS3** - Estilos e animações
- **Vanilla JavaScript** - Interatividade

## 📝 Personalização

### Cores

Edite as variáveis CSS em `public/styles.css`:

```css
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --accent: #14b8a6;
    /* ... */
}
```

### Conteúdo

Edite o arquivo `public/index.html` para modificar textos e seções.

### Funcionalidades

Adicione novas funcionalidades em `public/script.js`.

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto!

## 👨‍💻 Autor

**LiraGames Team**

---

Desenvolvido com ❤️ para a comunidade LiraGames
