import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useShop } from '../store/useShop';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  const handleCheckout = async () => {
    try {
      // 1. Create order in database for tracking
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userId: 'test-user-id',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // 2. Prepare WhatsApp message
        const { settings } = useShop.getState();
        const whatsappNumber = settings?.whatsapp_number || import.meta.env.VITE_WHATSAPP_NUMBER || '221770000000';
        const orderSummary = items.map(item => `- ${item.name} (x${item.quantity}): ${item.price * item.quantity}€`).join('\n');
        const message = `Bonjour ${settings?.name || 'Minane Shop'} ! Je souhaite commander :\n\n${orderSummary}\n\nTotal: ${total()}€\nID Commande: ${data.orderId}\n\nPeut-on en discuter ?`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // 3. Redirect to WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // 4. Clear cart after redirect
        // useCart.getState().clearCart(); // Optional: clear cart
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 px-4 max-w-7xl mx-auto text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag size={40} className="text-stone-400" />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-4">Votre panier est vide</h1>
        <p className="text-stone-500 mb-10">Il semble que vous n'ayez pas encore ajouté d'articles à votre panier.</p>
        <Link 
          to="/boutique" 
          className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-12">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-6 pb-8 border-b border-black/5"
            >
              <div className="w-32 h-40 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-serif font-bold">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-amber-700 font-mono mt-1">{item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-black/10 rounded-full px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:text-amber-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:text-amber-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold">{(item.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-stone-50 rounded-3xl p-8 sticky top-32">
            <h2 className="text-2xl font-serif font-bold mb-8">Résumé</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total</span>
                <span>{total().toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Livraison</span>
                <span className="text-green-600 font-bold uppercase text-xs tracking-widest">Offerte</span>
              </div>
              <div className="pt-4 border-t border-black/10 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-amber-700">{total().toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-2 group"
            >
              Négocier sur WhatsApp
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-stone-400 text-center mt-6 uppercase tracking-widest">
              Validation par message direct
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
