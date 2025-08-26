import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { X, CreditCard, Smartphone, FileText, Loader2 } from 'lucide-react'
import { useCart } from './CartContext'
import asaasService from '../services/asaasService'

const CheckoutModal = ({ isOpen, onClose }) => {
  const { items, getTotalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1) // 1: dados, 2: pagamento, 3: confirmação
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('PIX')
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    mobilePhone: '',
    address: '',
    addressNumber: '',
    city: '',
    state: '',
    postalCode: ''
  })
  const [paymentResult, setPaymentResult] = useState(null)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleCustomerDataChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateCustomerData = () => {
    const required = ['name', 'email', 'cpfCnpj', 'mobilePhone']
    return required.every(field => customerData[field].trim() !== '')
  }

  const handleNextStep = () => {
    if (step === 1 && validateCustomerData()) {
      setStep(2)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // 1. Criar ou buscar cliente
      let customer
      try {
        const existingCustomer = await asaasService.findCustomerByCpfCnpj(customerData.cpfCnpj)
        if (existingCustomer.data && existingCustomer.data.length > 0) {
          customer = existingCustomer.data[0]
        } else {
          customer = await asaasService.createCustomer(customerData)
        }
      } catch (error) {
        customer = await asaasService.createCustomer(customerData)
      }

      // 2. Criar cobrança
      const paymentData = asaasService.generateTestPayment(customer.id, items)
      paymentData.billingType = paymentMethod
      
      const payment = await asaasService.createPayment(paymentData)
      
      setPaymentResult(payment)
      setStep(3)
      
      // Limpar carrinho após sucesso
      setTimeout(() => {
        clearCart()
      }, 2000)
      
    } catch (error) {
      console.error('Erro no pagamento:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setPaymentResult(null)
    setCustomerData({
      name: '',
      email: '',
      cpfCnpj: '',
      mobilePhone: '',
      address: '',
      addressNumber: '',
      city: '',
      state: '',
      postalCode: ''
    })
    setPaymentMethod('PIX')
  }

  const handleClose = () => {
    resetModal()
    onClose()
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
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Finalizar Compra</CardTitle>
                <CardDescription>
                  {step === 1 && 'Preencha seus dados'}
                  {step === 2 && 'Escolha a forma de pagamento'}
                  {step === 3 && 'Pagamento criado com sucesso!'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Resumo do pedido */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Resumo do Pedido</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.title} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
            </div>

            {/* Etapa 1: Dados do cliente */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Dados do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={customerData.name}
                      onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                    <Input
                      id="cpfCnpj"
                      value={customerData.cpfCnpj}
                      onChange={(e) => handleCustomerDataChange('cpfCnpj', e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobilePhone">Telefone *</Label>
                    <Input
                      id="mobilePhone"
                      value={customerData.mobilePhone}
                      onChange={(e) => handleCustomerDataChange('mobilePhone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={customerData.address}
                      onChange={(e) => handleCustomerDataChange('address', e.target.value)}
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressNumber">Número</Label>
                    <Input
                      id="addressNumber"
                      value={customerData.addressNumber}
                      onChange={(e) => handleCustomerDataChange('addressNumber', e.target.value)}
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={customerData.city}
                      onChange={(e) => handleCustomerDataChange('city', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={customerData.state}
                      onChange={(e) => handleCustomerDataChange('state', e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 2: Forma de pagamento */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Forma de Pagamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card 
                    className={`cursor-pointer transition-colors ${paymentMethod === 'PIX' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setPaymentMethod('PIX')}
                  >
                    <CardContent className="p-4 text-center">
                      <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">PIX</h4>
                      <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-colors ${paymentMethod === 'BOLETO' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setPaymentMethod('BOLETO')}
                  >
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">Boleto</h4>
                      <p className="text-sm text-gray-600">Vencimento em 7 dias</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-colors ${paymentMethod === 'CREDIT_CARD' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                  >
                    <CardContent className="p-4 text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">Cartão</h4>
                      <p className="text-sm text-gray-600">Crédito ou débito</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Método selecionado:</strong> {paymentMethod === 'PIX' ? 'PIX - Pagamento instantâneo' : paymentMethod === 'BOLETO' ? 'Boleto Bancário' : 'Cartão de Crédito'}
                  </p>
                </div>
              </div>
            )}

            {/* Etapa 3: Confirmação */}
            {step === 3 && paymentResult && (
              <div className="space-y-4 text-center">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Pagamento Criado com Sucesso!</h3>
                  <p className="text-green-700 mb-4">
                    Seu pedido foi processado e o pagamento foi gerado.
                  </p>
                  
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm"><strong>ID do Pagamento:</strong> {paymentResult.id}</p>
                    <p className="text-sm"><strong>Status:</strong> {paymentResult.status}</p>
                    <p className="text-sm"><strong>Valor:</strong> {formatPrice(paymentResult.value)}</p>
                    
                    {paymentMethod === 'PIX' && paymentResult.pixTransaction && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Código PIX:</p>
                        <code className="text-xs bg-gray-100 p-2 rounded block mt-1 break-all">
                          {paymentResult.pixTransaction.qrCode.payload}
                        </code>
                      </div>
                    )}
                    
                    {paymentMethod === 'BOLETO' && paymentResult.bankSlipUrl && (
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(paymentResult.bankSlipUrl, '_blank')}
                        >
                          Visualizar Boleto
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {step > 1 && step < 3 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Voltar
              </Button>
            )}
            
            <div className="flex gap-2 ml-auto">
              {step === 1 && (
                <Button 
                  onClick={handleNextStep}
                  disabled={!validateCustomerData()}
                >
                  Continuar
                </Button>
              )}
              
              {step === 2 && (
                <Button 
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Finalizar Pagamento'
                  )}
                </Button>
              )}
              
              {step === 3 && (
                <Button onClick={handleClose}>
                  Fechar
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default CheckoutModal

