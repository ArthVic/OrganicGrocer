
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryProps {
  name: string;
  image: string;
  count: number;
  slug: string;
}

const Category: React.FC<CategoryProps> = ({ name, image, count, slug }) => {
  return (
    <Link
      to={`/products?category=${slug}`}
      className="group relative overflow-hidden rounded-xl shadow-md hover-scale transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
        <h3 className="font-heading font-bold text-xl">{name}</h3>
        <p className="text-sm opacity-80">{count} Products</p>
      </div>
    </Link>
  );
};

const CategorySection: React.FC = () => {
  const categories = [
    {
      name: 'Fruits',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1470&auto=format&fit=crop',
      count: 24,
      slug: 'fruits',
    },
    {
      name: 'Vegetables',
      image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=1512&auto=format&fit=crop',
      count: 36,
      slug: 'vegetables',
    },
    {
      name: 'Berries',
      image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=1632&auto=format&fit=crop',
      count: 12,
      slug: 'berries',
    },
    {
      name: 'Leafy Greens',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1480&auto=format&fit=crop',
      count: 18,
      slug: 'leafy-greens',
    },
  ];

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-4">
            Browse Categories
          </h2>
          <p className="text-earth-700 max-w-2xl mx-auto">
            Explore our wide selection of fresh organic produce sorted by category to find exactly what you need
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Category
              key={category.slug}
              name={category.name}
              image={category.image}
              count={category.count}
              slug={category.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
