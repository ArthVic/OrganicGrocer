
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-leaf-50 to-leaf-100 py-16 md:py-24">
      <div className="container-custom grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 max-w-lg">
          <span className="inline-block px-3 py-1 bg-white text-leaf-600 font-medium rounded-full text-sm">
            100% Organic Products
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-earth-900 leading-tight">
            Fresh & Organic <span className="text-leaf-600">Produce</span> Delivered to Your Door
          </h1>
          <p className="text-earth-700 text-lg">
            Experience the taste of nature with our hand-picked selection of organic fruits and vegetables, sourced from trusted local farms.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-leaf-600 hover:bg-leaf-700">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-leaf-600 text-leaf-600 hover:bg-leaf-50">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
          <div className="flex items-center space-x-6 pt-4">
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-earth-900">100+</span>
              <span className="text-earth-600 text-sm">Organic Products</span>
            </div>
            <div className="w-px h-12 bg-earth-200"></div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-earth-900">15+</span>
              <span className="text-earth-600 text-sm">Local Farms</span>
            </div>
            <div className="w-px h-12 bg-earth-200"></div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-earth-900">10k+</span>
              <span className="text-earth-600 text-sm">Happy Customers</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1470&auto=format&fit=crop" 
              alt="Fresh organic fruits and vegetables" 
              className="w-full h-full object-cover aspect-[4/3]"
            />
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
              <div className="text-sm text-earth-800">
                <p className="font-heading font-semibold">Fresh Harvest</p>
                <p>Picked today, delivered tomorrow</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-leaf-500 rounded-full p-4 shadow-lg hidden md:block">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white text-leaf-600 font-heading font-bold text-lg">
              20% OFF
            </div>
          </div>
        </div>
      </div>
      {/* Replace problematic SVG wave with a simpler bottom decoration */}
      <div className="absolute bottom-0 left-0 w-full h-6 bg-white" style={{
        clipPath: "polygon(0 100%, 100% 100%, 100% 40%, 75% 60%, 50% 40%, 25% 60%, 0 40%)"
      }}></div>
    </section>
  );
};

export default HeroSection;
