import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { X, Eye, EyeOff, Loader2, User, Mail, Phone, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register, resetPassword, loading } = useAuth()
  const [mode, setMode] = useState('login') // 'login', 'register', 'forgot'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (mode === 'register') {
      if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório'
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefone é obrigatório'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem'
      }
    }

    if (mode !== 'forgot') {
      if (!formData.email.trim()) {
        newErrors.email = 'E-mail é obrigatório'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'E-mail inválido'
      }

      if (!formData.password.trim()) {
        newErrors.password = 'Senha é obrigatória'
      } else if (mode === 'register' && formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'E-mail é obrigatório'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'E-mail inválido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      let result

      if (mode === 'login') {
        result = await login(formData.email, formData.password)
      } else if (mode === 'register') {
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      } else if (mode === 'forgot') {
        result = await resetPassword(formData.email)
      }

      if (result.success) {
        if (mode === 'forgot') {
          alert('E-mail de recuperação enviado!')
          setMode('login')
        } else {
          resetForm()
          onClose()
        }
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'Erro inesperado. Tente novamente.' })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    })
    setErrors({})
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForm()
    setMode('login')
    onClose()
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setErrors({})
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {mode === 'login' && 'Entrar'}
                  {mode === 'register' && 'Criar Conta'}
                  {mode === 'forgot' && 'Recuperar Senha'}
                </CardTitle>
                <CardDescription>
                  {mode === 'login' && 'Entre com sua conta Quantofy'}
                  {mode === 'register' && 'Crie sua conta para começar'}
                  {mode === 'forgot' && 'Digite seu e-mail para recuperar a senha'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
              )}

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === 'login' && 'Entrando...'}
                    {mode === 'register' && 'Criando conta...'}
                    {mode === 'forgot' && 'Enviando...'}
                  </>
                ) : (
                  <>
                    {mode === 'login' && 'Entrar'}
                    {mode === 'register' && 'Criar Conta'}
                    {mode === 'forgot' && 'Enviar E-mail'}
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                {mode === 'login' && (
                  <>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => switchMode('forgot')}
                    >
                      Esqueceu sua senha?
                    </button>
                    <div className="text-sm text-gray-600">
                      Não tem uma conta?{' '}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => switchMode('register')}
                      >
                        Criar conta
                      </button>
                    </div>
                  </>
                )}

                {mode === 'register' && (
                  <div className="text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => switchMode('login')}
                    >
                      Entrar
                    </button>
                  </div>
                )}

                {mode === 'forgot' && (
                  <div className="text-sm text-gray-600">
                    Lembrou da senha?{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => switchMode('login')}
                    >
                      Voltar ao login
                    </button>
                  </div>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  )
}

export default LoginModal

