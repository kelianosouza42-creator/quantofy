// Serviço para integração com a API do Asaas
class AsaasService {
  constructor() {
    // Para produção, use: https://api.asaas.com/v3
    // Para sandbox, use: https://sandbox.asaas.com/api/v3
    this.baseURL = 'https://sandbox.asaas.com/api/v3'
    
    // IMPORTANTE: Em produção, esta chave deve vir de variáveis de ambiente
    // Esta é uma chave de exemplo para sandbox
    this.apiKey = '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODI5ODI6OiRhYWNoXzlmZGIzOWY4LTM4YzQtNGJhYS1hYjU3LWRmZjcwNTZkZGY5Mw=='
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const url = `${this.baseURL}${endpoint}`
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'access_token': this.apiKey
      }
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Erro na API Asaas: ${errorData.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro na requisição para Asaas:', error)
      throw error
    }
  }

  // Criar cliente
  async createCustomer(customerData) {
    const data = {
      name: customerData.name,
      cpfCnpj: customerData.cpfCnpj,
      email: customerData.email,
      mobilePhone: customerData.mobilePhone,
      address: customerData.address,
      addressNumber: customerData.addressNumber,
      complement: customerData.complement,
      province: customerData.province,
      city: customerData.city,
      state: customerData.state,
      postalCode: customerData.postalCode
    }

    return await this.makeRequest('/customers', 'POST', data)
  }

  // Buscar cliente por CPF/CNPJ
  async findCustomerByCpfCnpj(cpfCnpj) {
    return await this.makeRequest(`/customers?cpfCnpj=${cpfCnpj}`)
  }

  // Criar cobrança
  async createPayment(paymentData) {
    const data = {
      customer: paymentData.customerId,
      billingType: paymentData.billingType, // PIX, BOLETO, CREDIT_CARD
      value: paymentData.value,
      dueDate: paymentData.dueDate,
      description: paymentData.description,
      externalReference: paymentData.externalReference,
      installmentCount: paymentData.installmentCount,
      installmentValue: paymentData.installmentValue,
      discount: paymentData.discount,
      interest: paymentData.interest,
      fine: paymentData.fine,
      postalService: paymentData.postalService
    }

    // Para cartão de crédito, adicionar informações do cartão
    if (paymentData.billingType === 'CREDIT_CARD' && paymentData.creditCard) {
      data.creditCard = paymentData.creditCard
      data.creditCardHolderInfo = paymentData.creditCardHolderInfo
    }

    return await this.makeRequest('/payments', 'POST', data)
  }

  // Buscar cobrança por ID
  async getPayment(paymentId) {
    return await this.makeRequest(`/payments/${paymentId}`)
  }

  // Listar cobranças
  async listPayments(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    const endpoint = queryParams ? `/payments?${queryParams}` : '/payments'
    return await this.makeRequest(endpoint)
  }

  // Criar link de pagamento
  async createPaymentLink(linkData) {
    const data = {
      name: linkData.name,
      description: linkData.description,
      endDate: linkData.endDate,
      value: linkData.value,
      billingType: linkData.billingType,
      chargeType: linkData.chargeType || 'DETACHED',
      maxInstallmentCount: linkData.maxInstallmentCount,
      notificationEnabled: linkData.notificationEnabled || true,
      callback: linkData.callback
    }

    return await this.makeRequest('/paymentLinks', 'POST', data)
  }

  // Webhook para receber notificações de pagamento
  async handleWebhook(webhookData) {
    // Processar webhook do Asaas
    const { event, payment } = webhookData

    switch (event) {
      case 'PAYMENT_RECEIVED':
        console.log('Pagamento recebido:', payment)
        // Implementar lógica para pagamento aprovado
        break
      case 'PAYMENT_OVERDUE':
        console.log('Pagamento vencido:', payment)
        // Implementar lógica para pagamento vencido
        break
      case 'PAYMENT_DELETED':
        console.log('Pagamento cancelado:', payment)
        // Implementar lógica para pagamento cancelado
        break
      default:
        console.log('Evento não tratado:', event)
    }

    return { status: 'success' }
  }

  // Validar webhook (verificar se veio realmente do Asaas)
  validateWebhook(signature, payload, secret) {
    // Implementar validação de assinatura do webhook
    // Esta é uma implementação básica - em produção, use crypto para validar
    return true
  }

  // Gerar dados de exemplo para teste
  generateTestCustomer() {
    return {
      name: 'Cliente Teste Quantofy',
      cpfCnpj: '12345678901',
      email: 'cliente@quantofy.com',
      mobilePhone: '11999999999',
      address: 'Rua Teste',
      addressNumber: '123',
      complement: 'Apto 1',
      province: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01234567'
    }
  }

  generateTestPayment(customerId, cartItems) {
    const totalValue = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    
    return {
      customerId: customerId,
      billingType: 'PIX', // Pode ser PIX, BOLETO, CREDIT_CARD
      value: totalValue,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
      description: `Compra Quantofy - ${cartItems.length} item(s)`,
      externalReference: `QUANTOFY-${Date.now()}`,
      discount: {
        value: 0,
        dueDateLimitDays: 0
      },
      interest: {
        value: 2
      },
      fine: {
        value: 1
      }
    }
  }
}

export default new AsaasService()

