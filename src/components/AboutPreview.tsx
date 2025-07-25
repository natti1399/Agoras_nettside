import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Clock, Award, ArrowRight } from 'lucide-react';

const AboutPreview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    students: 0,
    rating: 0,
    experience: 0,
    improvement: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate counters
          const targets = { students: 20, rating: 100, experience: 3, improvement: 100 };
          const duration = 2000;
          const steps = 60;
          const stepTime = duration / steps;
          
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounters({
              students: Math.floor(targets.students * progress),
              rating: Math.floor(targets.rating * progress),
              experience: Math.floor(targets.experience * progress),
              improvement: Math.floor(targets.improvement * progress)
            });
            
            if (step >= steps) {
              clearInterval(timer);
              setCounters(targets);
            }
          }, stepTime);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('om-meg-preview');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Users, value: `${counters.students}+`, label: 'Fornøyde Elever' },
    { icon: Clock, value: `${counters.experience}+`, label: 'År med Erfaring' },
    { icon: Star, value: `${counters.rating}%`, label: 'Svært Fornøyd med Undervisningen' },
    { icon: Award, value: `${counters.improvement}%`, label: 'Mener Innholdet er Relevant og Lett å Følge' }
  ];

  return (
    <section id="om-meg-preview" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 right-10 w-32 h-32 bg-[#741b1c] opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#741b1c] opacity-5 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hvorfor Velge Agoras?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jeg har hjulpet mange elever å mestre matematikk og nå sine akademiske mål
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#741b1c] to-transparent mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className={`text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-r from-[#741b1c] to-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#741b1c] mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Min Tilnærming
            </h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Jeg starter alltid med en grundig vurdering av elevens nåværende nivå og læringsstil.
        Dette gir meg grunnlaget for å lage en personlig læringsplan som sikrer optimal progresjon.
              </p>
              <p>
                Jeg fokuserer på å gjøre matematikk relevant og forståelig gjennom 
                praktiske eksempler og øvelser som er tilpasset elevens interesser og fremtidige mål.
              </p>
            </div>
            <Link 
              to="/om-meg"
              className="inline-flex items-center mt-6 text-[#741b1c] font-semibold hover:text-red-600 transition-colors"
            >
              Les mer om meg
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <img 
                src="/Haakon portrait.png" 
                alt="Håkon Ørås - Mathematics tutor"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;