import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('kontakt');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    console.log('Form submitted:', formData);
  };

  return (
    <section id="kontakt" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#741b1c] opacity-5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ta Kontakt
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Klar for å starte din matematikkreise? Vi er her for å hjelpe deg!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#741b1c] to-transparent mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Kom i Kontakt
            </h3>
            
            <div className="space-y-6 mb-8">
              {[
                { icon: Mail, title: 'E-post', info: 'agoras_norge@hotmail.com', delay: 'delay-300' },
                { icon: MapPin, title: 'Lokasjon', info: 'Kristiansand, Norge', delay: 'delay-400' }
              ].map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-start group hover:transform hover:scale-105 transition-all duration-300 ${contact.delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  >
                    <div className="bg-gradient-to-r from-[#741b1c] to-red-600 p-3 rounded-lg mr-4 group-hover:shadow-lg transition-shadow">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#741b1c] transition-colors">
                        {contact.title}
                      </h4>
                      <p className="text-gray-600 whitespace-pre-line">{contact.info}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-[#741b1c] mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Gratis Konsultasjon
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Book en gratis 30-minutters konsultasjon hvor vi vurderer elevens behov og 
                lager en personlig læringsplan. Ingen forpliktelser!
              </p>
            </div>

            {/* Contact image */}
            <div className={`mt-8 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <img 
                src="https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Contact us for mathematics tutoring"
                className="rounded-xl shadow-lg w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              {/* Success overlay */}
              {isSubmitted && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-95 flex items-center justify-center z-10 rounded-2xl">
                  <div className="text-center text-white">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold mb-2">Takk for din henvendelse!</h3>
                    <p>Vi tar kontakt med deg snart.</p>
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send oss en Melding
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-[#741b1c] transition-colors">
                      Navn *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent transition-all duration-300 hover:border-[#741b1c]"
                      placeholder="Ditt fulle navn"
                      required
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-[#741b1c] transition-colors">
                      E-post *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent transition-all duration-300 hover:border-[#741b1c]"
                      placeholder="din@epost.no"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-[#741b1c] transition-colors">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent transition-all duration-300 hover:border-[#741b1c]"
                      placeholder="+47 123 45 678"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-[#741b1c] transition-colors">
                      Nivå
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent transition-all duration-300 hover:border-[#741b1c]"
                    >
                      <option value="">Velg nivå</option>
                      <option value="ungdomsskole">Ungdomsskole (8.-10. trinn)</option>
                      <option value="videregaaende">Videregående (Vg1-Vg3)</option>
                      <option value="r1-r2">R1 & R2</option>
                    </select>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-[#741b1c] transition-colors">
                    Melding
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent transition-all duration-300 hover:border-[#741b1c] resize-none"
                    placeholder="Fortell oss om dine behov og mål..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#741b1c] to-red-600 text-white py-4 rounded-lg hover:from-[#5a1415] hover:to-red-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Melding</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;