import React, { useEffect, useState } from 'react';
import { useShop } from '../store/useShop';
import { useAdmin, Product } from '../store/useAdmin';
import { Save, Upload, Store, Package, Users, Settings as SettingsIcon, Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Admin = () => {
  const { settings, loading: shopLoading, fetchSettings, updateSettings } = useShop();
  const { products, categories, loading: adminLoading, fetchProducts, fetchCategories, addProduct, updateProduct, deleteProduct } = useAdmin();

  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (settings && activeTab === 'settings') {
      setFormData(settings);
    }
  }, [settings, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (activeTab === 'settings') {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      setCurrentProduct((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      alert('Paramètres mis à jour avec succès !');
    } catch (err) {
      alert('Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing && currentProduct?.id) {
        await updateProduct(currentProduct.id, currentProduct);
      } else {
        await addProduct(currentProduct as any);
      }
      setIsEditing(false);
      setCurrentProduct(null);
      alert('Produit enregistré avec succès !');
    } catch (err) {
      alert('Erreur lors de l\'enregistrement du produit.');
    } finally {
      setSaving(false);
    }
  };

  const startNewProduct = () => {
    setIsEditing(true);
    setCurrentProduct({
      name: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      image_url: '',
      category_id: categories[0]?.id || '',
      is_active: true
    });
  };

  const startEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct(id);
    }
  };

  if ((shopLoading || adminLoading) && !formData && activeTab === 'settings') {
    return (
      <div className="pt-40 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-amber-600 mb-4" size={40} />
        <p className="text-stone-500 font-serif italic">Chargement du panneau d'administration...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <h1 className="text-2xl font-serif font-bold mb-8 px-4 text-black">Administration</h1>

          <button
            onClick={() => { setActiveTab('settings'); setIsEditing(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-black text-white shadow-lg' : 'hover:bg-stone-100 text-stone-600'}`}
          >
            <SettingsIcon size={20} />
            Configuration
          </button>

          <button
            onClick={() => { setActiveTab('products'); setIsEditing(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-black text-white shadow-lg' : 'hover:bg-stone-100 text-stone-600'}`}
          >
            <Package size={20} />
            Produits
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 cursor-not-allowed"
            disabled
          >
            <Users size={20} />
            Clients (Bientôt)
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm"
              >
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl font-serif font-bold mb-2">Paramètres de la Boutique</h2>
                    <p className="text-stone-500">Gérez l'identité et les informations de contact.</p>
                  </div>
                  <Store className="text-amber-600" size={40} />
                </div>

                <form onSubmit={handleSettingsSubmit} className="space-y-8">
                  {formData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Nom de la Boutique</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-amber-500 transition-all text-black" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Numéro WhatsApp (221xxx)</label>
                        <input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-amber-500 transition-all text-black" required />
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">URL du Logo</label>
                        <input type="text" name="logo_url" value={formData.logo_url || ''} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-amber-500 transition-all text-black" />
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Description</label>
                        <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-amber-500 transition-all text-black resize-none" />
                      </div>
                    </div>
                  )}
                  <div className="pt-8 border-t border-stone-100">
                    <button type="submit" disabled={saving} className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-amber-600 transition-all flex items-center gap-3">
                      {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Enregistrer
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'products' && !isEditing && (
              <motion.div
                key="product-list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif font-bold">Produits</h2>
                  <button onClick={startNewProduct} className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-amber-600 transition-all text-sm uppercase tracking-widest font-bold">
                    <Plus size={18} /> Nouveau Produit
                  </button>
                </div>

                <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm text-black">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Produit</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Prix</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Stock</th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-stone-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                                {product.image_url && <img src={product.image_url} className="w-full h-full object-cover" />}
                              </div>
                              <div>
                                <div className="font-bold">{product.name}</div>
                                <div className="text-xs text-stone-400 uppercase tracking-tighter">{product.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium">{product.price.toLocaleString()} FCFA</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {product.stock} en stock
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => startEditProduct(product)} className="p-2 hover:bg-stone-200 rounded-lg transition-all text-stone-600"><Edit2 size={18} /></button>
                              <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg transition-all text-red-500"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && isEditing && currentProduct && (
              <motion.div
                key="product-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm text-black"
              >
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-serif font-bold">{isEditing && currentProduct.id ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
                  <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-stone-100 rounded-full"><X size={24} /></button>
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Nom</label>
                      <input type="text" name="name" value={currentProduct.name} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 text-black" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Slug (URL)</label>
                      <input type="text" name="slug" value={currentProduct.slug} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 text-black" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Prix (FCFA)</label>
                      <input type="number" name="price" value={currentProduct.price} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 text-black" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Stock</label>
                      <input type="number" name="stock" value={currentProduct.stock} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 text-black" required />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">URL Image</label>
                      <input type="text" name="image_url" value={currentProduct.image_url || ''} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 text-black" />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Description</label>
                      <textarea name="description" value={currentProduct.description || ''} onChange={handleInputChange} rows={3} className="w-full bg-stone-50 border-stone-200 rounded-xl py-4 px-6 text-black resize-none" />
                    </div>
                  </div>
                  <div className="pt-8 flex gap-4">
                    <button type="submit" disabled={saving} className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-amber-600 transition-all flex items-center gap-2">
                      {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Sauvegarder
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm border border-stone-200 hover:bg-stone-50 transition-all text-black">Annuler</button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
