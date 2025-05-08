
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProductDetail from '@/components/products/ProductDetail';

const ProductDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <ProductDetail />
    </MainLayout>
  );
};

export default ProductDetailPage;
