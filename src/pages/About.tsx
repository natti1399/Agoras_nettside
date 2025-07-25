import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Award, Quote, BookOpen, Target, TrendingUp, Heart } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    students: 0,
    rating: 0,
    experience: 0,
    improvement: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    
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

    return () => clearInterval(timer);
  }, []);

  const handleBookConsultation = () => {
    navigate('/kontakt');
  };

  const handleContactUs = () => {
    navigate('/kontakt');
  };

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
    },
    {
      name: 'Lisa',
      role: 'Elev',
      text: 'Jeg føler meg mer motivert og det er lettere å følge med i timen når man allerede har fått en introduksjon.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];



  const values = [
    {
      icon: Heart,
      title: 'Trygghet og Forståelse',
      description: 'Jeg skaper et trygt læringsmiljø hvor hver elev føler seg sett, forstått og motivert til å lære.'
    },
    {
      icon: Target,
      title: 'Personlig Tilpasset Læring',
      description: 'Gjennom kartlegging og tett oppfølging skaper jeg strukturer som gjør fremgang mulig for alle.'
    },
    {
      icon: TrendingUp,
      title: 'Mestring Gir Mot',
      description: 'Jeg tror at når elever opplever mestring, får de mot til å ta på seg nye utfordringer.'
    },
    {
      icon: BookOpen,
      title: 'Varig Læringsglede',
      description: 'Målet vårt er å bidra til et skoleløp preget av trygghet, nysgjerrighet og ekte engasjement.'
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
              Om <span className="text-[#741b1c]">Agoras</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Jeg tror at alle elever har potensial til å mestre matematikk – når undervisningen møter dem der de er
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#741b1c] to-transparent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Min Visjon</h2>
            </div>
            
            <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100">
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p className="text-xl font-medium text-gray-800">
                  Hos Agoras tror jeg at alle elever har potensial til å mestre matematikk – når undervisningen møter dem der de er.
                </p>
                
                <p>
                  Jeg vet at mange føler seg alene i møte med faget, og at det kan gå hardt utover både selvtillit og motivasjon. Min visjon er å være en trygg og faglig støttespiller for disse elevene.
                </p>
                
                <p className="font-medium text-gray-800">
                  Jeg ønsker å senke terskelen for å be om hjelp – og heve nivået på hjelpen man får.
                </p>
                
                <p>
                  Gjennom personlig tilpasset undervisning, kartlegging og tett oppfølging skaper jeg strukturer som gjør det mulig for hver enkelt elev å oppleve fremgang – uansett utgangspunkt.
                </p>
                
                <p>
                  Agoras skal være et sted der elever føler seg sett, forstått og motivert. Et sted der læring skjer i deres tempo, med ekte engasjement og faglig kvalitet i sentrum.
                </p>
                
                <div className="bg-white p-6 rounded-xl border-l-4 border-[#741b1c]">
                  <p className="text-xl font-semibold text-[#741b1c] mb-2">
                    Jeg tror at mestring gir mot.
                  </p>
                  <p className="text-gray-700">
                    Og målet vårt er enkelt: å bidra til et skoleløp preget av trygghet, nysgjerrighet og varig læringsglede.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className={`text-center bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mine Verdier</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Grunnpilarene som styrer alt jeg gjør hos Agoras
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={index}
                  className={`text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-[#741b1c] to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Litt om meg!</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Jeg heter Håkon Ørås, er 25 år gammel og bor i Kristiansand. Jeg går for øyeblikket på 5. året på lektorutdanningen i idrett og matematikk, og har 2 års erfaring som privatunderviser i matematikk.
                </p>
                <p>
                  Min lidenskap for matematikk og undervisning driver meg til å hjelpe unge med å mestre faget på en enkel og forståelig måte. Jeg har også erfaring som vikar på barneskole og mye praksis på ungdomsskole og videregående, så jeg har godt kjennskap til hva som skal til for å gjøre matematikk både engasjerende og lærerikt.
                </p>
                <p>
                  Når jeg ikke underviser, finner du meg gjerne på fotballbanen, på kjøkkenet hvor jeg laget god mat eller ute på nye opplevelser.
                </p>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <img 
                  src="/Haakon portrait.png" 
                  alt="Håkon Ørås - Mathematics tutor"
                  className="rounded-2xl shadow-2xl w-full h-[28rem] object-cover object-top"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-[#741b1c]">Kristiansand</div>
                  <div className="text-sm text-gray-600">Norge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hva Sier Mine Elever og Foreldre?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hør fra familier som har opplevd forskjellen Agoras kan gjøre
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${(index + 11) * 100}ms` }}
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#741b1c] to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Bli en Del av Agoras-Familien
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              La meg hjelpe deg eller ditt barn med å oppdage gleden ved matematikk
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

export default About;