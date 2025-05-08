
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1615485925600-97c8b02caff4?q=80&w=1470&auto=format&fit=crop" 
              alt="Fresh vegetables" 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-leaf-700/90 to-leaf-900/70"></div>
          </div>
          
          <div className="relative py-12 px-6 md:py-24 md:px-12 text-center text-white">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience the Organic Difference?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Join thousands of satisfied customers who have made the switch to healthier, tastier organic produce delivered right to their doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-leaf-700 hover:bg-earth-100">
                  <Link to="/products">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white text-leaf-700 hover:bg-earth-100">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm opacity-80">
                Free delivery on your first order with code: ORGANIC10
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
