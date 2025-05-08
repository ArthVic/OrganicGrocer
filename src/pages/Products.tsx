
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProductList from '@/components/products/ProductList';

const Products: React.FC = () => {
  return (
    <MainLayout>
      <ProductList />
    </MainLayout>
  );
};

export default Products;
