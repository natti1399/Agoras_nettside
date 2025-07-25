import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const handleTallyRedirect = () => {
    window.open('https://tally.so/r/31o4LW', '_blank');
  };

  const handleSendEmail = () => {
    window.open('mailto:agoras_norge@hotmail.com', '_blank');
  };

  const handleBookConsultation = () => {
    const contactSection = document.getElementById('kontakt-meg-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      question: 'Hvor mye koster undervisningen?',
      answer: 'Prisene varierer i forhold til det behovet eleven har. Vi tilbyr enkelttimer til 400kr/time, og pakker som varierer fra 780kr/mnd til 2800kr/mnd.'
    },
    {
      question: 'Hvor ofte anbefaler dere undervisning?',
      answer: 'Vi anbefaler minimum 1-2 timer hver uke, men dette tilpasses selvfølgelig elevens behov og mål.'
    },
    {
      question: 'Kan dere hjelpe med eksamensforberedelse?',
      answer: 'Ja, jeg har omfattende erfaring med å forberede elever til alle typer matematikkeksamener.'
    },
    {
      question: 'Tilbyr dere online undervisning?',
      answer: 'Ja, jeg tilbyr både fysisk og online undervisning med samme høye kvalitet.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-red-50 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#741b1c] opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#741b1c] opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ta <span className="text-[#741b1c]">Kontakt</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Klar for å starte din matematikkreise? Jeg er her for å hjelpe deg!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#741b1c] to-transparent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section id="kontakt-meg-section" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Contact CTA */}
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
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

                <button
                  onClick={handleTallyRedirect}
                  className="w-full bg-gradient-to-r from-[#741b1c] to-red-600 text-white py-4 rounded-lg hover:from-[#5a1415] hover:to-red-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Send className="h-5 w-5" />
                  <span>Fyll ut kontaktskjema</span>
                </button>
                
                <p className="text-sm text-gray-500 text-center mt-3">
                  Skjemaet åpnes i en ny fane
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ofte Stilte Spørsmål</h2>
            <p className="text-xl text-gray-600">
              Her finner du svar på de vanligste spørsmålene jeg får
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${(index + 7) * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#741b1c] to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Klar for å Starte?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Ta det første steget mot bedre matematikkferdigheter i dag
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleBookConsultation}
                className="bg-white text-[#741b1c] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Book Gratis Konsultasjon
              </button>
              <button 
                onClick={handleSendEmail}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#741b1c] transition-all duration-300 transform hover:scale-105"
              >
                Send E-post
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;