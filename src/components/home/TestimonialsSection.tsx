
import React from 'react';

interface TestimonialProps {
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 15.585l-5.857 3.09 1.12-6.524L.528 7.583l6.522-.95L10 .712l2.95 5.922 6.522.95-4.735 4.568 1.12 6.524L10 15.585z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, image, quote, rating }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="font-heading font-semibold">{name}</h4>
          <p className="text-earth-600 text-sm">{role}</p>
        </div>
      </div>
      <StarRating rating={rating} />
      <p className="mt-4 text-earth-700 italic">{quote}</p>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Customer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop',
      quote: 'The organic vegetables from OrganicGrocer have transformed our family meals. The taste is incredible, and knowing we\'re eating pesticide-free food gives me peace of mind.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Chef',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop',
      quote: 'As a professional chef, I demand the best ingredients. OrganicGrocer consistently delivers exceptional quality produce that elevates every dish I create.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Health Coach',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop',
      quote: 'I recommend OrganicGrocer to all my clients. The freshness and nutritional value of their produce is unmatched, and their delivery service is always prompt and reliable.',
      rating: 4,
    },
  ];

  return (
    <section className="py-16 bg-earth-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-earth-700 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our happy customers have to say about our organic produce
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              image={testimonial.image}
              quote={testimonial.quote}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
