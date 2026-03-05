import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../store/useCart';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .eq('slug', slug)
        .single();
      
      if (data) setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <div className="pt-40 text-center min-h-screen">Chargement...</div>;
  if (!product) return <div className="pt-40 text-center min-h-screen">Produit non trouvé.</div>;

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-black transition-colors mb-12 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[3/4] bg-stone-100 rounded-3xl overflow-hidden"
        >
          <img 
            src={product.image_url || 'https://picsum.photos/seed/fashion/800/1000'} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <p className="text-amber-600 uppercase tracking-[0.3em] text-xs font-bold mb-4">
              {product.category?.name || 'Collection Exclusive'}
            </p>
            <h1 className="text-5xl font-serif font-bold mb-6">{product.name}</h1>
            <p className="text-3xl font-mono text-amber-700 mb-8">
              {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </p>
            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed mb-10">
              {product.description || "Une pièce d'exception conçue avec les meilleurs matériaux pour un confort et un style inégalés."}
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
              </span>
            </div>

            <button 
              onClick={() => addItem(product)}
              disabled={product.stock <= 0}
              className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
            >
              <ShoppingBag size={20} />
              Ajouter au panier
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-black/5">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={20} className="text-stone-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Livraison 48h</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={20} className="text-stone-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Paiement Sécurisé</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RefreshCw size={20} className="text-stone-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Retours Gratuits</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
