import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  User, 
  ShoppingBag, 
  Download, 
  Settings, 
  CreditCard, 
  FileText,
  Calendar,
  Star,
  Edit,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const UserDashboard = ({ isOpen, onClose }) => {
  const { user, updateProfile, getUserPurchases } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  })

  const purchases = getUserPurchases()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleSaveProfile = async () => {
    const result = await updateProfile(editData)
    if (result.success) {
      setIsEditing(false)
      alert('Perfil atualizado com sucesso!')
    } else {
      alert('Erro ao atualizar perfil: ' + result.error)
    }
  }

  const handleCancelEdit = () => {
    setEditData({
      name: user?.name || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Minha Conta</CardTitle>
                <CardDescription>Gerencie seu perfil e visualize suas compras</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r bg-gray-50 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <User className="h-4 w-4 mr-3" />
                  Perfil
                </button>
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'purchases' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4 mr-3" />
                  Minhas Compras
                </button>
                <button
                  onClick={() => setActiveTab('downloads')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'downloads' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <Download className="h-4 w-4 mr-3" />
                  Downloads
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Informações do Perfil</h3>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSaveProfile}>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                      <p className="text-xs text-gray-500">O e-mail não pode ser alterado</p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label>Membro desde</Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Estatísticas da Conta</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{purchases.length}</p>
                        <p className="text-sm text-blue-800">Compras</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(purchases.reduce((total, p) => total + (p.total || 0), 0))}
                        </p>
                        <p className="text-sm text-blue-800">Total Gasto</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {purchases.filter(p => p.status === 'completed').length}
                        </p>
                        <p className="text-sm text-blue-800">Concluídas</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchases Tab */}
              {activeTab === 'purchases' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Histórico de Compras</h3>
                  
                  {purchases.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Você ainda não fez nenhuma compra.</p>
                      <Button className="mt-4" onClick={onClose}>
                        Explorar Produtos
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <Card key={purchase.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Pedido #{purchase.id}</h4>
                                <p className="text-sm text-gray-600">
                                  {formatDate(purchase.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatPrice(purchase.total)}</p>
                                <Badge 
                                  variant={purchase.status === 'completed' ? 'default' : 'secondary'}
                                >
                                  {purchase.status === 'completed' ? 'Concluído' : 'Pendente'}
                                </Badge>
                              </div>
                            </div>
                            
                            {purchase.items && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm font-medium mb-2">Itens:</p>
                                {purchase.items.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.title} x{item.quantity}</span>
                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Downloads Tab */}
              {activeTab === 'downloads' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Meus Downloads</h3>
                  
                  <div className="text-center py-8">
                    <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Seus downloads aparecerão aqui após a confirmação do pagamento.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default UserDashboard

