import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Zap, CheckCircle } from 'lucide-react';

const CoursesPreview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('kurs-preview');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleBookPackage = () => {
    navigate('/kontakt');
  };

  const handleBookSingleLesson = () => {
    navigate('/kontakt');
  };

  const packages = [
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
      description: 'Min mest omfattende pakke for maksimal læring',
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

  return (
    <section id="kurs-preview" className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mine Pakker
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Velg den pakken som passer best for dine behov og mål
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#741b1c] to-transparent mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const IconComponent = pkg.icon;
            return (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 transform-gpu ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${pkg.popular ? 'ring-2 ring-[#741b1c] scale-105' : ''}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
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
                    Velg Pakke
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Enkelttime</h3>
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-3xl font-bold text-[#741b1c]">400kr</span>
              <span className="text-gray-600 ml-1">per time</span>
            </div>
            <p className="text-gray-600 mb-6">
              Perfekt for å prøve meg ut eller for sporadisk hjelp. Ingen binding eller forpliktelser.
            </p>
            <button 
              onClick={handleBookSingleLesson}
              className="border-2 border-[#741b1c] text-[#741b1c] px-8 py-3 rounded-lg hover:bg-[#741b1c] hover:text-white transition-all duration-300 font-semibold transform hover:scale-105"
            >
              Book Enkelttime
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;