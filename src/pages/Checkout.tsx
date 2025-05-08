
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CheckoutPage from '@/components/checkout/CheckoutPage';

const Checkout: React.FC = () => {
  return (
    <MainLayout>
      <CheckoutPage />
    </MainLayout>
  );
};

export default Checkout;
