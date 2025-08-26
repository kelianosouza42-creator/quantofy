import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react'
import { useCart } from './CartContext'
import CheckoutModal from './CheckoutModal'

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
    className="fixed inset-0 bg-opacity-50 z-40"    onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Carrinho</h2>
            {items.length > 0 && (
              <Badge variant="secondary">{items.length}</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
              <Button onClick={onClose} variant="outline">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.category}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-gray-500">
                              {formatPrice(item.price)} cada
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2 h-6 px-2 text-xs"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setIsCheckoutOpen(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Finalizar Compra
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  )
}

export default CartDrawer

