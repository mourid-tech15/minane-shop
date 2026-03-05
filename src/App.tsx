import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from './store/useShop';
import { useAuth } from './store/useAuth';

const Success = () => (
  <div className="pt-40 px-4 max-w-7xl mx-auto text-center min-h-screen">
    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h1 className="text-4xl font-serif font-bold mb-4">Merci pour votre commande !</h1>
    <p className="text-stone-500 mb-10">Un email de confirmation vous a été envoyé. Nous préparons votre colis avec le plus grand soin.</p>
    <a href="/" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors">
      Retour à l'accueil
    </a>
  </div>
);

export default function App() {
  const { settings, fetchSettings } = useShop();
  const { initialize } = useAuth();

  useEffect(() => {
    fetchSettings();
    initialize();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/boutique" element={<Shop />} />
              <Route path="/produit/:slug" element={<ProductDetails />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/success" element={<Success />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-stone-50 border-t border-black/5 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-1">
                <Link to="/" className="flex flex-col items-start mb-6">
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt={settings.name} className="h-12 object-contain mb-2" referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <span className="text-2xl font-serif font-bold tracking-widest text-black">
                        {settings?.name.split(' ')[0] || 'MINANE'}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-amber-600 -mt-1">
                        {settings?.name.split(' ')[1] || 'SHOP'}
                      </span>
                    </>
                  )}
                </Link>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {settings?.description || "L'excellence de la mode sénégalaise, portée par les valeurs de tradition et d'élégance."}
                </p>
              </div>
              <div>
                <h4 className="font-serif font-bold mb-6">Boutique</h4>
                <ul className="space-y-4 text-sm text-stone-500">
                  <li><Link to="/boutique" className="hover:text-amber-600 transition-colors">Tous les produits</Link></li>
                  <li><Link to="/categories" className="hover:text-amber-600 transition-colors">Collections</Link></li>
                  <li><Link to="/nouveautes" className="hover:text-amber-600 transition-colors">Nouveautés</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-serif font-bold mb-6">Aide</h4>
                <ul className="space-y-4 text-sm text-stone-500">
                  <li><Link to="/livraison" className="hover:text-amber-600 transition-colors">Livraison</Link></li>
                  <li><Link to="/retours" className="hover:text-amber-600 transition-colors">Retours</Link></li>
                  <li><Link to="/faq" className="hover:text-amber-600 transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-serif font-bold mb-6">Contact</h4>
                <ul className="space-y-4 text-sm text-stone-500">
                  <li>{settings?.email || 'contact@minaneshop.com'}</li>
                  <li>{settings?.whatsapp_number ? `+${settings.whatsapp_number}` : '+221 33 000 00 00'}</li>
                  <li>{settings?.address || 'Dakar, Sénégal'}</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] uppercase tracking-widest text-stone-400">© 2026 {settings?.name || 'MINANE SHOP'}. TOUS DROITS RÉSERVÉS.</p>
              <div className="flex gap-6">
                <a href="#" className="text-stone-400 hover:text-black transition-colors"><span className="text-[10px] uppercase tracking-widest">Instagram</span></a>
                <a href="#" className="text-stone-400 hover:text-black transition-colors"><span className="text-[10px] uppercase tracking-widest">Facebook</span></a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Helper for Link in App.tsx since it's used in footer
import { Link as RouterLink } from 'react-router-dom';
const Link = RouterLink;
