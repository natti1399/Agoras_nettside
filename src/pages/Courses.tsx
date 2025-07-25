import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Award, CheckCircle, CreditCard, Star, Zap } from 'lucide-react';

const Courses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const handleBookPackage = () => {
    navigate('/kontakt');
  };

  const handleBookConsultation = () => {
    navigate('/kontakt');
  };

  const handleContactUs = () => {
    navigate('/kontakt');
  };

  const packages = [
    {
      name: 'Enkelttime',
      price: '400kr',
      period: 'per time',
      description: 'Perfekt for å prøve meg ut eller for sporadisk hjelp',
      features: [
        'En undervisningstime',
        'Fysisk eller online',
        'Ingen binding',
        'Fleksibel booking'
      ],
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      name: 'Standard',
      price: '780kr',
      period: '/mnd',
      description: 'Ideell for regelmessig oppfølging og stødig fremgang',
      features: [
        '2 undervisningstimer',
        'Tydelige læringsmål',
        'Skreddersydd undervisningsløp',
        'Fysisk eller online'
      ],
      icon: Users,
      color: 'from-green-500 to-green-600',
      popular: false
    },
    {
      name: 'Pluss',
      price: '1500kr',
      period: '/mnd',
      description: 'For elever som trenger ekstra støtte og tett oppfølging',
      features: [
        '4 undervisningstimer',
        'Tydelige læringsmål',
        'Skreddersydd undervisningsløp',
        'Fysisk eller online',
        'Fleksibel undervisning'
      ],
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      name: 'Premium',
      price: '2900kr',
      period: '/mnd',
      description: 'Min mest omfattende pakke for maksimal læring og fremgang',
      features: [
        '8 undervisningstimer',
        'Tydelige læringsmål',
        'Skreddersydd undervisningsløp',
        'Fysisk eller online',
        'Fleksibel undervisning',
        'Egen læringsmappe'
      ],
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      popular: false
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Personlig Tilnærming',
      description: 'Hver elev får individuell oppmerksomhet og tilpasset undervisning'
    },
    {
      icon: Clock,
      title: 'Fleksible Timer',
      description: 'Book timer når det passer deg best - fysisk eller online'
    },
    {
      icon: Award,
      title: 'Kvalifisert Lærer',
      description: 'Jeg har relevant utdanning og dokumentert erfaring'
    },
    {
      icon: CheckCircle,
      title: 'Høy Kvalitet',
      description: '100% av mine elever er svært fornøyd med undervisningen'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-red-50 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#741b1c] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#741b1c] opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Mine <span className="text-[#741b1c]">Pakker</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Velg den pakken som passer best for dine behov og mål
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#741b1c] to-transparent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  className={`text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-[#741b1c] to-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {packages.map((pkg, index) => {
              const IconComponent = pkg.icon;
              
              return (
                <div 
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 transform-gpu ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${pkg.popular ? 'ring-2 ring-[#741b1c] scale-105' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#741b1c] text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Mest Populær
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className={`bg-gradient-to-r ${pkg.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-[#741b1c]">{pkg.price}</span>
                        <span className="text-gray-600 ml-1">{pkg.period}</span>
                      </div>
                      <p className="text-gray-600 mt-3 text-sm leading-relaxed">{pkg.description}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button 
                      onClick={handleBookPackage}
                      className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        pkg.popular 
                          ? 'bg-[#741b1c] text-white hover:bg-[#5a1415] shadow-lg hover:shadow-xl' 
                          : 'border-2 border-[#741b1c] text-[#741b1c] hover:bg-[#741b1c] hover:text-white'
                      }`}
                    >
                      {pkg.name === 'Enkelttime' ? 'Book Enkelttime' : 'Velg Pakke'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hva Inkluderer Pakkene?</h2>
            <p className="text-xl text-gray-600">
              Alle mine pakker er designet for å gi maksimal læring og fremgang
            </p>
          </div>

          <div className="space-y-8">
            <div className={`bg-gray-50 p-8 rounded-xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Skreddersydd undervisning</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">• Personlig undervisning</h4>
                  <p className="text-gray-600 leading-relaxed ml-4">
                    Undervisningen foregår en-til-en, enten fysisk eller online, slik at eleven får tett oppfølging.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">• Tydelige læringsmål</h4>
                  <p className="text-gray-600 leading-relaxed ml-4">
                    Hver elev får konkrete mål og fokusområder vi jobber systematisk med.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">• Fleksibel undervisning</h4>
                  <p className="text-gray-600 leading-relaxed ml-4">
                    Velg selv mellom fysisk eller digital undervisning, tilpasset elevens timeplan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#741b1c] to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Usikker på Hvilken Pakke som Passer?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Book en gratis konsultasjon så hjelper jeg deg med å finne den perfekte løsningen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleBookConsultation}
                className="bg-white text-[#741b1c] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Book Gratis Konsultasjon
              </button>
              <button 
                onClick={handleContactUs}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#741b1c] transition-all duration-300 transform hover:scale-105"
              >
                Kontakt Meg
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;