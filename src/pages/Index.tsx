
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';

const Index: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <BenefitsSection />
      <TestimonialsSection />
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
