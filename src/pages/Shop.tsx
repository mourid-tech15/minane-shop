import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useShop } from '../store/useShop';

export const Shop = () => {
  const { settings } = useShop();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: productsData } = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .eq('is_active', true);
      
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*');

      if (productsData) setProducts(productsData);
      if (categoriesData) setCategories(categoriesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">{settings?.name || 'La Boutique'}</h1>
          <p className="text-stone-500">{settings?.description || "Explorez notre collection exclusive d'habits et accessoires."}</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-100 border-none rounded-full py-3 pl-12 pr-6 focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-stone-100 border-none rounded-full py-3 pl-6 pr-12 focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-stone-100 aspect-[3/4] rounded-2xl mb-4"></div>
              <div className="h-4 bg-stone-100 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-stone-100 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-stone-100 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-stone-500 text-lg">Aucun produit ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
};
