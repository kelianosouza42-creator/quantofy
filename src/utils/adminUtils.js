// Utilitários para funcionalidades administrativas

// Função para criar usuário administrador padrão
export const createDefaultAdmin = () => {
  const users = JSON.parse(localStorage.getItem('quantofy_users') || '[]')
  
  // Verificar se já existe um admin
  const existingAdmin = users.find(user => user.role === 'admin')
  if (existingAdmin) {
    return existingAdmin
  }

  // Criar admin padrão
  const defaultAdmin = {
    id: 'admin_' + Date.now(),
    name: 'Administrador Quantofy',
    email: 'admin@quantofy.com',
    password: 'admin123', // Em produção, usar hash
    phone: '11999999999',
    role: 'admin',
    createdAt: new Date().toISOString()
  }

  users.push(defaultAdmin)
  localStorage.setItem('quantofy_users', JSON.stringify(users))
  
  console.log('Admin padrão criado:', {
    email: defaultAdmin.email,
    password: 'admin123'
  })

  return defaultAdmin
}

// Função para obter estatísticas do sistema
export const getSystemStats = () => {
  const users = JSON.parse(localStorage.getItem('quantofy_users') || '[]')
  const customers = users.filter(user => user.role === 'customer')
  
  // Buscar todas as compras
  let allPurchases = []
  customers.forEach(customer => {
    const purchases = JSON.parse(localStorage.getItem(`quantofy_purchases_${customer.id}`) || '[]')
    allPurchases = [...allPurchases, ...purchases]
  })

  const totalRevenue = allPurchases.reduce((total, purchase) => total + (purchase.total || 0), 0)
  const completedPurchases = allPurchases.filter(p => p.status === 'completed')
  const pendingPurchases = allPurchases.filter(p => p.status === 'pending')

  return {
    totalUsers: customers.length,
    totalPurchases: allPurchases.length,
    completedPurchases: completedPurchases.length,
    pendingPurchases: pendingPurchases.length,
    totalRevenue,
    averageOrderValue: allPurchases.length > 0 ? totalRevenue / allPurchases.length : 0,
    recentPurchases: allPurchases
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
  }
}

// Função para obter lista de usuários
export const getAllUsers = () => {
  const users = JSON.parse(localStorage.getItem('quantofy_users') || '[]')
  return users.filter(user => user.role === 'customer')
}

// Função para obter todas as compras
export const getAllPurchases = () => {
  const users = getAllUsers()
  let allPurchases = []
  
  users.forEach(user => {
    const purchases = JSON.parse(localStorage.getItem(`quantofy_purchases_${user.id}`) || '[]')
    const purchasesWithUser = purchases.map(purchase => ({
      ...purchase,
      userName: user.name,
      userEmail: user.email
    }))
    allPurchases = [...allPurchases, ...purchasesWithUser]
  })

  return allPurchases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// Função para atualizar status de compra
export const updatePurchaseStatus = (purchaseId, newStatus) => {
  const users = getAllUsers()
  
  for (const user of users) {
    const purchases = JSON.parse(localStorage.getItem(`quantofy_purchases_${user.id}`) || '[]')
    const purchaseIndex = purchases.findIndex(p => p.id === purchaseId)
    
    if (purchaseIndex !== -1) {
      purchases[purchaseIndex].status = newStatus
      purchases[purchaseIndex].updatedAt = new Date().toISOString()
      localStorage.setItem(`quantofy_purchases_${user.id}`, JSON.stringify(purchases))
      return true
    }
  }
  
  return false
}

// Função para gerenciar produtos (estrutura para futuro)
export const getProducts = () => {
  // Por enquanto, retorna produtos estáticos
  // Em produção, isso viria de uma API ou banco de dados
  return [
    {
      id: 1,
      title: "Sistema ERP Completo",
      description: "Sistema de gestão empresarial com módulos financeiro, estoque e vendas",
      price: 299.90,
      originalPrice: 499.90,
      category: "Gestão",
      technologies: ["PHP", "MySQL", "Bootstrap"],
      active: true,
      featured: true,
      downloads: 1250,
      rating: 4.8
    },
    {
      id: 2,
      title: "Loja Virtual Responsiva",
      description: "Template completo para e-commerce com painel administrativo",
      price: 149.90,
      originalPrice: 249.90,
      category: "E-commerce",
      technologies: ["React", "Node.js", "MongoDB"],
      active: true,
      featured: true,
      downloads: 2100,
      rating: 4.9
    },
    {
      id: 3,
      title: "App Delivery Multi-Restaurante",
      description: "Aplicativo completo para delivery com integração WhatsApp",
      price: 199.90,
      originalPrice: 349.90,
      category: "Mobile",
      technologies: ["React Native", "Firebase"],
      active: true,
      featured: true,
      downloads: 890,
      rating: 4.7
    }
  ]
}

// Função para salvar produtos (estrutura para futuro)
export const saveProducts = (products) => {
  localStorage.setItem('quantofy_products', JSON.stringify(products))
  return true
}

// Função para exportar dados
export const exportData = (type) => {
  let data = {}
  
  switch (type) {
    case 'users':
      data = getAllUsers()
      break
    case 'purchases':
      data = getAllPurchases()
      break
    case 'stats':
      data = getSystemStats()
      break
    default:
      data = {
        users: getAllUsers(),
        purchases: getAllPurchases(),
        stats: getSystemStats()
      }
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `quantofy_${type}_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Função para limpar dados de teste
export const clearTestData = () => {
  if (confirm('Tem certeza que deseja limpar todos os dados de teste? Esta ação não pode ser desfeita.')) {
    localStorage.removeItem('quantofy_users')
    localStorage.removeItem('quantofy_products')
    
    // Limpar compras de todos os usuários
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('quantofy_purchases_')) {
        localStorage.removeItem(key)
      }
    })
    
    alert('Dados de teste limpos com sucesso!')
    window.location.reload()
  }
}

// Inicializar admin padrão quando o módulo for carregado
if (typeof window !== 'undefined') {
  // Criar admin padrão apenas se estivermos no browser
  setTimeout(() => {
    createDefaultAdmin()
  }, 1000)
}

