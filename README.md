# Quantofy - Plataforma de E-commerce para Sistemas e Softwares

## 📋 Sobre o Projeto

Quantofy é uma plataforma completa de e-commerce especializada na venda de sistemas, softwares e soluções digitais. Desenvolvida com React e tecnologias modernas, oferece uma experiência de compra profissional e intuitiva.

## ✨ Funcionalidades Principais

### 🛒 E-commerce Completo
- **Carrinho de Compras**: Sistema completo com adição, remoção e controle de quantidade
- **Checkout Integrado**: Processo de compra em 3 etapas com validação
- **Pagamentos**: Integração com Asaas (PIX, Boleto, Cartão de Crédito)
- **Produtos**: Catálogo organizado por categorias com filtros

### 👤 Sistema de Usuários
- **Autenticação**: Login e registro com validação
- **Dashboard do Usuário**: Perfil, histórico de compras e downloads
- **Edição de Perfil**: Atualização de dados pessoais
- **Persistência**: Sessões mantidas no localStorage

### 🎨 Interface Moderna
- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Componentes UI**: Baseado em shadcn/ui com Tailwind CSS
- **Ícones**: Lucide React para interface consistente
- **Animações**: Transições suaves e feedback visual

### 🔧 Recursos Técnicos
- **React 18**: Framework moderno com hooks
- **Vite**: Build tool rápido e eficiente
- **Context API**: Gerenciamento de estado global
- **LocalStorage**: Persistência de dados local
- **API Integration**: Pronto para integração com backend

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18, JavaScript ES6+
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Build**: Vite
- **Package Manager**: pnpm
- **Deployment**: Vercel Ready

## 📁 Estrutura do Projeto

```
sistemas-online/
├── public/                 # Arquivos públicos
├── src/
│   ├── assets/            # Imagens e recursos
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes base (shadcn/ui)
│   │   ├── CartContext.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── CheckoutModal.jsx
│   │   ├── LoginModal.jsx
│   │   ├── UserDashboard.jsx
│   │   └── AdminRoute.jsx
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.jsx
│   ├── services/          # Serviços e APIs
│   │   └── asaasService.js
│   ├── utils/             # Utilitários
│   │   └── adminUtils.js
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos globais
│   └── main.jsx          # Ponto de entrada
├── dist/                  # Build de produção
├── package.json
└── README.md
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- pnpm (recomendado) ou npm

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd sistemas-online

# Instale as dependências
pnpm install

# Execute em desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview do build
pnpm run preview
```

## 🔑 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# API do Asaas
VITE_ASAAS_API_KEY=your_asaas_api_key
VITE_ASAAS_API_URL=https://sandbox.asaas.com/api/v3
```

### Configuração do Asaas
1. Crie uma conta no [Asaas](https://www.asaas.com)
2. Obtenha sua API Key no painel administrativo
3. Configure a URL da API (sandbox ou produção)

## 👥 Sistema de Usuários

### Usuário Administrador Padrão
O sistema cria automaticamente um usuário administrador:
- **Email**: admin@quantofy.com
- **Senha**: admin123

### Roles de Usuário
- **customer**: Usuário comum (comprador)
- **admin**: Administrador do sistema

## 🛒 Fluxo de Compra

1. **Navegação**: Usuário navega pelos produtos
2. **Carrinho**: Adiciona produtos ao carrinho
3. **Login**: Faz login ou cria conta (opcional)
4. **Checkout**: Preenche dados de cobrança
5. **Pagamento**: Escolhe método e finaliza
6. **Confirmação**: Recebe confirmação e acesso aos downloads

## 🎨 Customização

### Cores e Tema
As cores principais estão definidas em `src/App.css`:
```css
:root {
  --primary: 220 90% 56%;      /* Azul principal */
  --secondary: 142 76% 36%;    /* Verde secundário */
  --accent: 25 95% 53%;        /* Laranja destaque */
}
```

### Produtos
Os produtos estão definidos em `src/utils/adminUtils.js` na função `getProducts()`. Para adicionar novos produtos, edite esta função ou implemente uma API backend.

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Segurança

- Validação de formulários no frontend
- Sanitização de dados de entrada
- Prevenção de XSS básica
- Armazenamento seguro no localStorage

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros Provedores
O projeto é compatível com:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Qualquer hosting de arquivos estáticos

## 📊 Funcionalidades Futuras

### Painel Administrativo
- Gerenciamento de produtos
- Relatórios de vendas
- Gestão de usuários
- Configurações do sistema

### Melhorias Técnicas
- Backend com Node.js/Express
- Banco de dados (PostgreSQL/MongoDB)
- Sistema de arquivos para uploads
- Cache e otimizações

### Funcionalidades Adicionais
- Sistema de avaliações
- Cupons de desconto
- Newsletter
- Chat de suporte
- Notificações push

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- **Email**: suporte@quantofy.com
- **WhatsApp**: (11) 99999-9999
- **Documentação**: [docs.quantofy.com](https://docs.quantofy.com)

## 🎯 Roadmap

- [ ] Implementar painel administrativo
- [ ] Adicionar sistema de reviews
- [ ] Integrar com mais gateways de pagamento
- [ ] Implementar sistema de afiliados
- [ ] Adicionar analytics e métricas
- [ ] Criar app mobile (React Native)

---

**Desenvolvido com ❤️ pela equipe Quantofy**

