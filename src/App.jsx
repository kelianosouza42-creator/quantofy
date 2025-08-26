import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, ShoppingCart, User, Menu, Zap, Truck, Shield, Code, Star, Download, Eye, LogOut, Settings } from 'lucide-react'
import { CartProvider, useCart } from './components/CartContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import CartDrawer from './components/CartDrawer'
import LoginModal from './components/LoginModal'
import UserDashboard from './components/UserDashboard'
import softwareHero from './assets/software-hero.jpg'
import businessManagement from './assets/business-management.png'
import digitalProducts from './assets/digital-products.jpeg'
import productTypes from './assets/product-types.png'
import './App.css'

const Header = ({ searchQuery, setSearchQuery }) => {
  const { getTotalItems } = useCart()
  const { user, logout } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">Quantofy</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Encontre o sistema ideal para você..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Olá, {user.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setIsDashboardOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Minha Conta
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 h-12 text-sm">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80">
                <Menu className="h-4 w-4 mr-2" />
                Categorias
              </Button>
              <a href="#" className="hover:text-accent transition-colors">Sistemas de Gestão</a>
              <a href="#" className="hover:text-accent transition-colors">E-commerce</a>
              <a href="#" className="hover:text-accent transition-colors">Mobile</a>
              <a href="#" className="hover:text-accent transition-colors">Scripts</a>
              <a href="#" className="hover:text-accent transition-colors">Templates</a>
              <a href="#" className="hover:text-accent transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <UserDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
    </>
  )
}

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        {product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
            {product.discount}% OFF
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{product.category}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>
        <CardTitle className="text-lg">{product.title}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-4">
          {product.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Download className="h-4 w-4 mr-1" />
            {product.downloads}
          </div>
          <div className="text-right">
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <div className="text-2xl font-bold text-primary">
              R$ {product.price.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Comprar
        </Button>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')

  const featuredProducts = [
    {
      id: 1,
      title: "Sistema ERP Completo",
      description: "Sistema de gestão empresarial com módulos financeiro, estoque e vendas",
      price: 299.90,
      originalPrice: 499.90,
      discount: 40,
      image: businessManagement,
      category: "Gestão",
      rating: 4.8,
      downloads: 1250,
      technologies: ["PHP", "MySQL", "Bootstrap"]
    },
    {
      id: 2,
      title: "Loja Virtual Responsiva",
      description: "Template completo para e-commerce com painel administrativo",
      price: 149.90,
      originalPrice: 249.90,
      discount: 40,
      image: digitalProducts,
      category: "E-commerce",
      rating: 4.9,
      downloads: 2100,
      technologies: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 3,
      title: "App Delivery Multi-Restaurante",
      description: "Aplicativo completo para delivery com integração WhatsApp",
      price: 199.90,
      originalPrice: 349.90,
      discount: 43,
      image: productTypes,
      category: "Mobile",
      rating: 4.7,
      downloads: 890,
      technologies: ["React Native", "Firebase"]
    }
  ]

  const categories = [
    { name: "Sistemas de Gestão", icon: "🏢", count: 45 },
    { name: "E-commerce", icon: "🛒", count: 32 },
    { name: "Aplicativos Mobile", icon: "📱", count: 28 },
    { name: "Scripts PHP", icon: "💻", count: 67 },
    { name: "Templates", icon: "🎨", count: 54 },
    { name: "Automação", icon: "⚡", count: 23 }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Transforme Seu Negócio com <span className="text-accent">Quantofy</span>
              </h1>
              <p className="text-xl mb-8 text-primary-foreground/90">
                A plataforma completa para sistemas e softwares profissionais. 
                Quantifique seus resultados com nossas soluções digitais de alta qualidade.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Explorar Produtos
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Ver Demonstração
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={softwareHero} 
                alt="Soluções de Software" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Produtos digitais enviados em até 2 horas</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Suporte Técnico</h3>
              <p className="text-gray-600">Atendimento especializado incluído</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Código Fonte</h3>
              <p className="text-gray-600">Acesso completo para customizações</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Garantia</h3>
              <p className="text-gray-600">30 dias para devolução ou troca</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
            <p className="text-xl text-gray-600">Soluções mais populares e bem avaliadas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorias Principais</h2>
            <p className="text-xl text-gray-600">Encontre a solução perfeita para sua necessidade</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} produtos</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quantofy</h3>
              <p className="text-sm">
                Sua plataforma de confiança para sistemas e softwares profissionais. 
                Quantifique seus resultados com soluções digitais de alta qualidade.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sistemas de Gestão</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-commerce</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Aplicativos Mobile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Scripts PHP</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Quantofy. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}

export default App

