
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-leaf-50 py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-earth-900 mb-6">
              Our Mission is to Bring Organic Food to Your Table
            </h1>
            <p className="text-lg text-earth-700 mb-8">
              We're dedicated to providing the freshest organic produce, ethically sourced from sustainable farms, directly to your doorstep.
            </p>
            <Button asChild className="bg-leaf-600 hover:bg-leaf-700">
              <Link to="/products">Shop Our Products</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Our Story Section */}
      <div className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-earth-900 mb-6">Our Story</h2>
              <p className="text-earth-700 mb-4">
                Founded in 2015, OrganicGrocer began with a simple belief: everyone deserves access to healthy, organic food at reasonable prices.
              </p>
              <p className="text-earth-700 mb-4">
                What started as a small farmer's market stand has grown into a nationwide delivery service, but our commitment to quality, sustainability, and community hasn't changed.
              </p>
              <p className="text-earth-700">
                We work directly with small-scale organic farmers, ensuring fair prices for them and the freshest produce for you. Every product we sell meets our rigorous standards for organic certification, taste, and environmental impact.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop"
                alt="Organic farm"
                className="w-full h-full object-cover aspect-4/3"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="bg-earth-50 py-16">
        <div className="container-custom">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-earth-900 mb-12 text-center">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-leaf-600 text-2xl">🌱</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-earth-700">
                We're committed to sustainable farming practices that protect our planet for future generations. All our packaging is eco-friendly and recyclable.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-leaf-600 text-2xl">👨‍🌾</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Community</h3>
              <p className="text-earth-700">
                We support local farmers and communities through fair pricing, employment opportunities, and educational programs about sustainable agriculture.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-leaf-600 text-2xl">✨</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Quality</h3>
              <p className="text-earth-700">
                We never compromise on quality. Each product meets strict organic certification standards and is hand-selected for freshness and flavor.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="py-16">
        <div className="container-custom">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-earth-900 mb-12 text-center">Meet Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1470&auto=format&fit=crop"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-1">Sarah Johnson</h3>
              <p className="text-leaf-600 mb-2">Founder & CEO</p>
              <p className="text-earth-700">
                With 15+ years in organic farming, Sarah leads our mission to make organic food accessible to everyone.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1470&auto=format&fit=crop"
                  alt="Michael Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-1">Michael Chen</h3>
              <p className="text-leaf-600 mb-2">Head of Sourcing</p>
              <p className="text-earth-700">
                Michael works directly with our partner farmers to ensure we're sourcing the best organic produce possible.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1470&auto=format&fit=crop"
                  alt="Aisha Patel"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-1">Aisha Patel</h3>
              <p className="text-leaf-600 mb-2">Sustainability Director</p>
              <p className="text-earth-700">
                Aisha leads our sustainability initiatives, ensuring we minimize our environmental impact at every step.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-leaf-600 py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
              Join Our Organic Movement
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Experience the difference of truly fresh, organic produce delivered directly to your door.
            </p>
            <Button asChild className="bg-white text-leaf-600 hover:bg-gray-100">
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
