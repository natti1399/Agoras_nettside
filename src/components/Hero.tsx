import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, ChevronDown } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBookConsultation = () => {
    navigate('/kontakt');
  };

  const handleViewCourses = () => {
    navigate('/kurs');
  };

  return (
    <section id="hjem" className="relative bg-gradient-to-br from-white via-gray-50 to-red-50 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#741b1c] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#741b1c] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Læring der du er
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Synes du matematikk er komplisert? Kontakt meg i dag for å ta kontroll over matematikken! 
            </p>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Jeg tilbyr privatundervisning en til en, hvor enn du måtte trenge det - både fysisk og online!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleBookConsultation}
                className="group bg-[#741b1c] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#5a1415] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  Book Gratis Konsultasjon
                  <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </button>
              <button 
                onClick={handleViewCourses}
                className="border-2 border-[#741b1c] text-[#741b1c] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#741b1c] hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Se Mine Kurs
              </button>
            </div>
          </div>

          {/* Right side - Hero image */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#741b1c] to-red-600 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
              <img 
                src="/Agoras hero.png" 
                alt="Agoras matematikkundervisning" 
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover transform hover:scale-105 transition-transform duration-500"
              />

            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: BookOpen,
              title: "Personlig Tilnærming",
              description: "Hver elev får en skreddersydd læringsplan tilpasset deres individuelle behov og læringsstil.",
              delay: "delay-100"
            },
            {
              icon: Users,
              title: "Erfaren Lærer",
      description: "Jeg har omfattende erfaring med det norske utdanningssystemet og viser dokumenterte resultater.",
              delay: "delay-300"
            },
            {
              icon: Award,
              title: "Høy Kvalitet",
              description: "100% av mine elever er svært fornøyd med undervisningen.",
              delay: "delay-500"
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                className={`group text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${feature.delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="bg-gradient-to-r from-[#741b1c] to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#741b1c] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ChevronDown className="h-6 w-6 text-[#741b1c]" />
      </div>
    </section>
  );
};

export default Hero;