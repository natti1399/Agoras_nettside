import React, { useEffect, useState } from 'react';
import { Star, Users, Clock, Award, Quote } from 'lucide-react';

const About = () => {
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

    const element = document.getElementById('om-meg');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Users, value: `${counters.students}+`, label: 'Fornøyde Elever' },
    { icon: Clock, value: `${counters.experience}+`, label: 'År med Erfaring' },
    { icon: Star, value: `${counters.rating}%`, label: 'Svært Fornøyd med Undervisningen' },
    { icon: Award, value: `${counters.improvement}%`, label: 'Mener Innholdet er Relevant og Lett å Følge' }
  ];

  const testimonials = [
    {
      name: 'Emma',
      role: 'Elev',
      text: 'Jeg har større lyst til å jobbe med faget, økt selvtillit og høyere karakter.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Magnus',
      role: 'Elev',
      text: 'Jeg har forstått mer av faget og det har gitt meg en bedre mestringsfølelse.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Sofie',
      role: 'Elev',
      text: 'Jeg har fått mer skryt av lærere på både innsats og muntlig i timer. Jeg har også gått opp en karakter i matte.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  return (
    <section id="om-meg" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-[#741b1c] opacity-5 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#741b1c] opacity-5 rounded-full blur-2xl animate-pulse delay-1000"></div>

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

        {/* Stats with animations */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className={`text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-r from-[#741b1c] to-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#741b1c] mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Testimonials with images */}
        <div className="mb-16">
          <h3 className={`text-2xl font-bold text-gray-900 text-center mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Hva Sier Mine Elever og Foreldre?
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-[#741b1c] opacity-20" />
                </div>
                <p className="text-gray-600 mb-4 italic leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Approach with background image */}
        <div className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Mathematics learning environment"
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="relative p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Min Tilnærming
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-xl font-semibold text-[#741b1c] mb-3 group-hover:text-red-600 transition-colors">
                    Individuell Læring
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Jeg starter alltid med en grundig vurdering av elevens nåværende nivå og læringsstil. 
                    Dette gir meg grunnlaget for å lage en personlig læringsplan som sikrer optimal progresjon.
                  </p>
                </div>
                
                <div className="group">
                  <h4 className="text-xl font-semibold text-[#741b1c] mb-3 group-hover:text-red-600 transition-colors">
                    Praksisnær Undervisning
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Jeg fokuserer på å gjøre matematikk relevant og forståelig gjennom praktiske eksempler 
                    og øvelser som er tilpasset elevens interesser og fremtidige mål.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-xl font-semibold text-[#741b1c] mb-3 group-hover:text-red-600 transition-colors">
                    Kontinuerlig Oppfølging
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Foreldre får regelmessige oppdateringer om elevens progresjon, og jeg justerer 
                    undervisningen underveis for å sikre at målene nås.
                  </p>
                </div>
                
                <div className="group">
                  <h4 className="text-xl font-semibold text-[#741b1c] mb-3 group-hover:text-red-600 transition-colors">
                    Eksamensforberedelse
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Jeg har omfattende erfaring med å forberede elever til både nasjonale prøver, 
                    avsluttende eksamen og opptak til høyere utdanning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;