import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useState, FormEvent, ChangeEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAdmin } from '../context/AdminContext';

export default function Contact() {
  const { siteSettings } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    subject: '',
    message: '',
    botcheck: false, // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Honeypot check
    if (formData.botcheck) {
      console.warn("Bot detected.");
      return;
    }

    // Rate limiting check
    const lastSubmitTime = localStorage.getItem('lastSubmitTime');
    if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime) < 60000) {
      setErrorMessage("Please wait a minute before sending another message.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { botcheck, ...submitData } = formData;
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          ...submitData
        }),
      });
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', whatsapp: '', subject: '', message: '', botcheck: false });
        localStorage.setItem('lastSubmitTime', Date.now().toString());
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Contact Us | ApporLeader</title>
        <meta name="description" content="Get in touch with ApporLeader for inquiries, partnerships, or to join our community." />
      </Helmet>
      {/* Header */}
      <section className="py-20 bg-[#050505] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Get in <span className="text-primary">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Have a question or want to collaborate? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Whether you're interested in joining our club, partnering for an event, or just have a general inquiry, our team is ready to assist you.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Our Location</h3>
                    <p className="text-gray-400">Dhaka, Bangladesh</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-highlight/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={24} className="text-highlight" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Email Address</h3>
                    <a href={`mailto:${siteSettings.contactEmail}`} className="text-gray-400 hover:text-highlight transition-colors">{siteSettings.contactEmail}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">WhatsApp</h3>
                    <a href={siteSettings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary transition-colors">Message us on WhatsApp</a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="w-full h-64 bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233667.8223908687!2d90.27923710646989!3d23.780887457084543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1709664555000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dhaka, Bangladesh Map"
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#050505] p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
              
              <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
              
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                  <p className="text-gray-400 mb-8">Thank you for reaching out. We will get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-8 py-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors font-medium"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                      {errorMessage}
                    </div>
                  )}
                  {/* Honeypot field */}
                  <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} checked={formData.botcheck} onChange={handleChange} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        maxLength={100}
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number</label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        required
                        maxLength={20}
                        pattern="[0-9\+\-\s\(\)]+"
                        title="Please enter a valid phone number"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        maxLength={200}
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="How can we help you?"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      maxLength={5000}
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(255,95,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
