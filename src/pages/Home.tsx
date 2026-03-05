import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../store/useShop';

const FEATURED_PRODUCTS = [
  { id: '1', name: 'Grand Boubou Royal', price: 250, slug: 'boubou-royal', image_url: 'https://picsum.photos/seed/boubou/600/800' },
  { id: '2', name: 'Tunique Élégance', price: 120, slug: 'tunique-elegance', image_url: 'https://picsum.photos/seed/tunique/600/800' },
  { id: '3', name: 'Accessoire Orfèvre', price: 85, slug: 'accessoire-or', image_url: 'https://picsum.photos/seed/jewelry/600/800' },
  { id: '4', name: 'Kaftan Moderne', price: 180, slug: 'kaftan-moderne', image_url: 'https://picsum.photos/seed/kaftan/600/800' },
];

export const Home = () => {
  const { settings } = useShop();
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/senegal/1920/1080" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-amber-500 uppercase tracking-[0.5em] text-sm font-bold mb-4 block">Collection 2026</span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-8">
              {settings?.name || 'MINANE SHOP'} <br />
              <span className="italic text-amber-500">L'Élégance Pure</span>
            </h1>
            <p className="text-lg text-stone-300 mb-10 max-w-lg leading-relaxed">
              Découvrez une collection unique alliant tradition sénégalaise et raffinement contemporain. Des pièces d'exception pour des moments inoubliables.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link 
                to="/boutique" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all flex items-center gap-2 group"
              >
                Découvrir la Boutique
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-stone-50 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5">
                <Star className="text-amber-600" />
              </div>
              <h3 className="font-serif text-xl">Qualité Premium</h3>
              <p className="text-stone-500 text-sm">Des tissus nobles sélectionnés avec le plus grand soin.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5">
                <Truck className="text-amber-600" />
              </div>
              <h3 className="font-serif text-xl">Livraison Express</h3>
              <p className="text-stone-500 text-sm">Expédition sécurisée dans le monde entier sous 48h.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5">
                <MessageCircle className="text-amber-600" />
              </div>
              <h3 className="font-serif text-xl">Négociation Directe</h3>
              <p className="text-stone-500 text-sm">Discutez directement avec nous sur WhatsApp pour vos commandes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-4">Nos Incontournables</h2>
              <p className="text-stone-500">Les pièces les plus prisées de notre dernière collection.</p>
            </div>
            <Link to="/boutique" className="text-amber-600 font-bold uppercase tracking-widest text-sm hover:underline flex items-center gap-2">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img src="https://picsum.photos/seed/pattern/800/800" alt="Pattern" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">Rejoignez le Cercle <br /><span className="text-amber-500">{settings?.name || 'Minane Shop'}</span></h2>
            <p className="text-stone-400 mb-10 text-lg">Inscrivez-vous à notre newsletter pour recevoir nos nouvelles collections en avant-première et des offres exclusives.</p>
            <form className="flex gap-4">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
