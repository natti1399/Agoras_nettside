import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

const ContactPreview = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('kontakt-preview');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="kontakt-preview" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
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
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Kom i Kontakt
            </h3>
            
            <div className="space-y-6 mb-8">
              {[
                { icon: Mail, title: 'E-post', info: 'agoras_norge@hotmail.com' },
                { icon: MapPin, title: 'Lokasjon', info: 'Kristiansand, Norge' }
              ].map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start group hover:transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="bg-gradient-to-r from-[#741b1c] to-red-600 p-3 rounded-lg mr-4 group-hover:shadow-lg transition-shadow">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#741b1c] transition-colors">
                        {contact.title}
                      </h4>
                      <p className="text-gray-600">{contact.info}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link 
              to="/kontakt"
              className="inline-flex items-center bg-[#741b1c] text-white px-8 py-4 rounded-lg hover:bg-[#5a1415] transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Kontakt Oss
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <img 
              src="https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=600" 
              alt="Contact us for mathematics tutoring"
              className="rounded-xl shadow-lg w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPreview;