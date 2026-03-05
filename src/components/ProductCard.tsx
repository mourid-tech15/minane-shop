import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../store/useCart';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    slug: string;
    category?: { name: string };
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCart((state) => state.addItem);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-2xl">
        <img 
          src={product.image_url || 'https://picsum.photos/seed/fashion/600/800'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button 
            onClick={() => addItem(product)}
            className="bg-white text-black p-4 rounded-full hover:bg-amber-600 hover:text-white transition-colors shadow-xl"
          >
            <ShoppingBag size={20} />
          </button>
          <Link 
            to={`/produit/${product.slug}`}
            className="bg-white text-black p-4 rounded-full hover:bg-amber-600 hover:text-white transition-colors shadow-xl"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-stone-500">
          {product.category?.name || 'Collection'}
        </p>
        <h3 className="font-serif text-lg text-stone-900">{product.name}</h3>
        <p className="font-mono text-sm text-amber-700">{product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
      </div>
    </motion.div>
  );
};
