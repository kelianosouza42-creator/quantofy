import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar se há usuário logado no localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('quantofy_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error)
        localStorage.removeItem('quantofy_user')
      }
    }
    setLoading(false)
  }, [])

  // Salvar usuário no localStorage quando o estado mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('quantofy_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('quantofy_user')
    }
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    
    try {
      // Simular autenticação (em produção, fazer requisição para API)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay da API
      
      // Verificar credenciais (em produção, validar no backend)
      const users = JSON.parse(localStorage.getItem('quantofy_users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (!foundUser) {
        throw new Error('E-mail ou senha incorretos')
      }

      // Remover senha do objeto do usuário por segurança
      const { password: _, ...userWithoutPassword } = foundUser
      
      setUser({
        ...userWithoutPassword,
        lastLogin: new Date().toISOString()
      })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    
    try {
      // Simular registro (em produção, fazer requisição para API)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay da API
      
      // Verificar se o e-mail já existe
      const users = JSON.parse(localStorage.getItem('quantofy_users') || '[]')
      const existingUser = users.find(u => u.email === userData.email)
      
      if (existingUser) {
        throw new Error('E-mail já cadastrado')
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // Em produção, hash da senha
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        role: 'customer'
      }

      // Salvar usuário na lista
      users.push(newUser)
      localStorage.setItem('quantofy_users', JSON.stringify(users))

      // Fazer login automático após registro
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    setLoading(true)
    
    try {
      // Simular atualização (em produção, fazer requisição para API)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Atualizar usuário na lista
      const users = JSON.parse(localStorage.getItem('quantofy_users') || '[]')
      const userIndex = users.findIndex(u => u.id === user.id)
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...profileData }
        localStorage.setItem('quantofy_users', JSON.stringify(users))
        
        // Atualizar usuário atual
        setUser(prev => ({ ...prev, ...profileData }))
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    setLoading(true)
    
    try {
      // Simular reset de senha (em produção, enviar e-mail)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const users = JSON.parse(localStorage.getItem('quantofy_users') || '[]')
      const foundUser = users.find(u => u.email === email)
      
      if (!foundUser) {
        throw new Error('E-mail não encontrado')
      }
      
      // Em produção, enviar e-mail com link de reset
      console.log('E-mail de reset enviado para:', email)
      
      return { success: true, message: 'E-mail de recuperação enviado' }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const isAuthenticated = () => {
    return !!user
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const getUserPurchases = () => {
    if (!user) return []
    
    // Buscar compras do usuário (em produção, fazer requisição para API)
    const purchases = JSON.parse(localStorage.getItem(`quantofy_purchases_${user.id}`) || '[]')
    return purchases
  }

  const addPurchase = (purchaseData) => {
    if (!user) return
    
    const purchases = getUserPurchases()
    const newPurchase = {
      id: Date.now().toString(),
      userId: user.id,
      ...purchaseData,
      createdAt: new Date().toISOString()
    }
    
    purchases.push(newPurchase)
    localStorage.setItem(`quantofy_purchases_${user.id}`, JSON.stringify(purchases))
    
    return newPurchase
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    isAuthenticated,
    hasRole,
    getUserPurchases,
    addPurchase
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

