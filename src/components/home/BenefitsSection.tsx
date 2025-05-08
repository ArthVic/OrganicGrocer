
import React from 'react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-full bg-leaf-100 flex items-center justify-center text-leaf-600 mb-4">
        {icon}
      </div>
      <h3 className="font-heading font-semibold text-xl mb-2">{title}</h3>
      <p className="text-earth-700">{description}</p>
    </div>
  );
};

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-4">
            Why Choose Organic?
          </h2>
          <p className="text-earth-700 max-w-2xl mx-auto">
            Switching to organic produce has numerous benefits for your health, the environment, and local communities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BenefitCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            title="Healthier Choice"
            description="Organic produce contains fewer pesticides and no GMOs, making it a healthier option for you and your family."
          />
          
          <BenefitCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Eco-Friendly"
            description="Organic farming practices promote biodiversity, reduce pollution, and help preserve our planet for future generations."
          />
          
          <BenefitCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            title="Better Taste"
            description="Without artificial enhancers, organic produce develops its full, natural flavor for a superior taste experience."
          />
          
          <BenefitCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Support Local Farms"
            description="By choosing organic, you're supporting sustainable farming practices and local family-owned farms in your community."
          />
        </div>
        
        {/* Additional Information Row */}
        <div className="bg-leaf-50 rounded-xl p-8 mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center md:border-r md:border-leaf-200">
            <div className="font-heading font-bold text-4xl text-leaf-600 mb-2">100%</div>
            <div className="text-earth-700">Certified Organic Products</div>
          </div>
          <div className="text-center md:border-r md:border-leaf-200">
            <div className="font-heading font-bold text-4xl text-leaf-600 mb-2">24/7</div>
            <div className="text-earth-700">Online Support</div>
          </div>
          <div className="text-center">
            <div className="font-heading font-bold text-4xl text-leaf-600 mb-2">Free</div>
            <div className="text-earth-700">Delivery on Orders Over $50</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
