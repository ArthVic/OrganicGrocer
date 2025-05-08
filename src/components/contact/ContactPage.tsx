
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container-custom py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8 text-center">Contact Us</h1>
      
      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-leaf-600" />
          </div>
          <h3 className="font-heading text-xl font-semibold mb-2">Phone</h3>
          <p className="text-earth-700 mb-3">Customer Support</p>
          <a href="tel:+1-800-123-4567" className="text-leaf-600 font-medium">+1 (800) 123-4567</a>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-leaf-600" />
          </div>
          <h3 className="font-heading text-xl font-semibold mb-2">Email</h3>
          <p className="text-earth-700 mb-3">Send us a message anytime</p>
          <a href="mailto:support@organicgrocer.com" className="text-leaf-600 font-medium">support@organicgrocer.com</a>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-leaf-600" />
          </div>
          <h3 className="font-heading text-xl font-semibold mb-2">Location</h3>
          <p className="text-earth-700 mb-3">Visit our main office</p>
          <address className="text-leaf-600 font-medium not-italic">
            123 Organic Way, Fresh Meadows, CA 90210
          </address>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="font-heading text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-leaf-600 hover:bg-leaf-700 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Business Hours & Map */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-leaf-100 rounded-full flex-shrink-0 flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-leaf-600" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-4">Business Hours</h2>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-earth-700">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-earth-700">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-earth-700">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="font-heading text-2xl font-semibold mb-4">Our Location</h2>
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-leaf-50 text-leaf-600">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive map would be displayed here</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">OrganicGrocer Headquarters</h3>
              <address className="text-earth-700 not-italic">
                123 Organic Way<br />
                Fresh Meadows, CA 90210<br />
                United States
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
