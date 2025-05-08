
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '@/contexts/CartContext';

export const useProducts = (category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = supabase.from('products').select('*');
        
        if (category && category !== '') {
          // Use a case-insensitive search for category
          query = query.ilike('category', `%${category}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform the data to match the Product interface
        const formattedData = data.map((item): Product => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          certification: item.certification,
          description: item.description,
          nutritionInfo: item.nutrition_info,
          weight: item.weight
        }));

        setProducts(formattedData);
      } catch (err: any) {
        setError(err.message);
        toast.error(`Failed to load products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Set up realtime subscription for products
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [...prev, payload.new as any]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as any : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(item => item.id !== payload.old.id));
          }
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  return { products, loading, error };
};

export const useSingleProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Transform the data to match the Product interface
        setProduct({
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.image,
          category: data.category,
          certification: data.certification,
          description: data.description,
          nutritionInfo: data.nutrition_info,
          weight: data.weight
        });
      } catch (err: any) {
        setError(err.message);
        toast.error(`Failed to load product: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Set up realtime subscription for this specific product
    const channel = supabase
      .channel(`public:products:id=eq.${id}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'products', filter: `id=eq.${id}` }, 
        (payload) => {
          const updatedData = payload.new;
          setProduct({
            id: updatedData.id,
            name: updatedData.name,
            price: updatedData.price,
            image: updatedData.image,
            category: updatedData.category,
            certification: updatedData.certification,
            description: updatedData.description,
            nutritionInfo: updatedData.nutrition_info,
            weight: updatedData.weight
          });
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { product, loading, error };
};
