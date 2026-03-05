import React, { useState } from 'react';
import { useAuth } from '../store/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password, fullName);
                alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                setIsLogin(true);
                setLoading(false);
                return;
            }
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-50 overflow-hidden relative">
            {/* Decorative backgrounds */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-stone-200 rounded-full blur-3xl opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white border border-stone-200 rounded-[2.5rem] p-10 shadow-xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6 shadow-lg shadow-black/10">
                        <Sparkles className="text-amber-400" size={32} />
                    </div>
                    <h1 className="text-4xl font-serif font-bold mb-2 text-black">
                        {isLogin ? 'Bon retour' : 'Bienvenue'}
                    </h1>
                    <p className="text-stone-500 font-medium">
                        {isLogin ? 'Entrez vos détails pour continuer' : 'Rejoignez Minane Shop aujourd\'hui'}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-2">Nom Complet</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-stone-50 border-stone-100 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-black font-medium"
                                        placeholder="Abdoulaye Diop"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-stone-50 border-stone-100 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-black font-medium"
                                placeholder="contact@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-stone-50 border-stone-100 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-black font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-amber-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/5 disabled:bg-stone-300 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {isLogin ? 'Se Connecter' : 'Créer un Compte'}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-stone-400 text-sm font-medium hover:text-black transition-colors"
                    >
                        {isLogin ? (
                            <>Vous n'avez pas de compte ? <span className="text-amber-600 font-bold ml-1">S'inscrire</span></>
                        ) : (
                            <>Vous avez déjà un compte ? <span className="text-amber-600 font-bold ml-1">Se connecter</span></>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
