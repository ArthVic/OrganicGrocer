
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <div className="product-image-container relative h-48 md:h-56 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.certification === 'Certified Organic' && (
            <div className="absolute top-0 right-0 bg-leaf-600 text-white text-xs px-2 py-1 m-2 rounded-md">
              Organic
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-earth-600">{product.category}</p>
          <h3 className="font-heading font-semibold text-lg mt-1">{product.name}</h3>
          <div className="flex justify-between items-center mt-3">
            <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
            <span className="text-sm text-earth-600">{product.weight}</span>
          </div>
          <Button
            size="sm"
            className="w-full mt-3 bg-leaf-600 hover:bg-leaf-700"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useProducts();
  
  // Get only 4 products for the featured section
  const featuredProducts = products.slice(0, 4);
  
  if (loading) {
    return (
      <section className="py-16 bg-earth-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-earth-900">
                Featured Products
              </h2>
              <p className="text-earth-700 mt-2">
                Loading products...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-earth-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-earth-900">
              Featured Products
            </h2>
            <p className="text-earth-700 mt-2">
              Hand-picked quality products from our organic farms
            </p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex border-leaf-600 text-leaf-600 hover:bg-leaf-50">
            <Link to="/products">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-10 md:hidden">
          <Button asChild className="bg-leaf-600 hover:bg-leaf-700">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
