import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowRight, CheckCircle, Send } from 'lucide-react';

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
            Klar for å starte din matematikkreise? Jeg er her for å hjelpe deg!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#741b1c] to-transparent mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Kom i Kontakt
            </h2>
            
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
                      <p className="text-gray-600 whitespace-pre-line">{contact.info}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h4 className="font-bold text-[#741b1c] mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Gratis Konsultasjon
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Book en gratis 30-minutters konsultasjon hvor jeg vurderer elevens behov og 
                lager en personlig læringsplan. Ingen forpliktelser!
              </p>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Contact Form Box */}
            <div className="bg-white shadow-lg rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Kontakt Meg
              </h3>
              <p className="text-gray-600 mb-6">
                Klar for å starte din matematikkreise? Fyll ut kontaktskjemaet vårt for å komme i gang!
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Hva kan du forvente?</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Personlig tilpasset undervisning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Fleksible tidspunkter
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Gratis konsultasjon
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Rask respons
                  </li>
                </ul>
              </div>

              <a 
                href="https://tally.so/r/31o4LW"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-[#741b1c] to-red-600 text-white px-6 py-4 rounded-lg hover:from-[#5a1415] hover:to-red-700 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Send className="mr-2 h-5 w-5" />
                Fyll ut kontaktskjema
              </a>
              <p className="text-sm text-gray-500 text-center mt-3">
                Skjemaet åpnes i en ny fane
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPreview;