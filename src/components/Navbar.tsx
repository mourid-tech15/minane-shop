import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, Search, Shield, LogOut } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useShop } from '../store/useShop';
import { useAuth } from '../store/useAuth';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const items = useCart((state) => state.items);
  const { settings } = useShop();
  const { session, profile, signOut } = useAuth();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.name} className="h-10 object-contain" referrerPolicy="no-referrer" />
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/boutique" className="text-sm uppercase tracking-widest hover:text-amber-600 transition-colors">Boutique</Link>
            <Link to="/categories" className="text-sm uppercase tracking-widest hover:text-amber-600 transition-colors">Collections</Link>
            <Link to="/contact" className="text-sm uppercase tracking-widest hover:text-amber-600 transition-colors">Contact</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            {profile?.role === 'admin' && (
              <Link to="/admin" className="p-2 hover:text-amber-600 transition-colors" title="Administration">
                <Shield size={20} />
              </Link>
            )}
            <button className="p-2 hover:text-amber-600 transition-colors">
              <Search size={20} />
            </button>
            <div className="flex items-center gap-2">
              {session ? (
                <>
                  <Link to="/compte" className="p-2 hover:text-amber-600 transition-colors" title={profile?.full_name || 'Mon Compte'}>
                    <UserIcon size={20} />
                  </Link>
                  <button onClick={handleLogout} className="p-2 hover:text-red-600 transition-colors" title="Déconnexion">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link to="/auth" className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-black/5">
                  <UserIcon size={16} />
                  <span>Connexion</span>
                </Link>
              )}
            </div>
            <Link to="/panier" className="p-2 hover:text-amber-600 transition-colors relative">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-black/5 overflow-hidden text-black"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/boutique" className="block text-sm uppercase tracking-widest py-2" onClick={() => setIsOpen(false)}>Boutique</Link>
              <Link to="/categories" className="block text-sm uppercase tracking-widest py-2" onClick={() => setIsOpen(false)}>Collections</Link>
              <Link to="/contact" className="block text-sm uppercase tracking-widest py-2" onClick={() => setIsOpen(false)}>Contact</Link>
              {session ? (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left text-sm uppercase tracking-widest py-2 text-red-600 font-bold">Déconnexion</button>
              ) : (
                <Link to="/auth" className="block text-sm uppercase tracking-widest py-2 text-amber-600 font-bold" onClick={() => setIsOpen(false)}>Connexion / Inscription</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
