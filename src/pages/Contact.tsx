import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, Send, CheckCircle, MessageCircle, Calendar, Users } from 'lucide-react';

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
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
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

  const handleSendEmail = () => {
    window.open('mailto:agoras_norge@hotmail.com', '_blank');
  };

  const handleStartChat = () => {
    console.log('Chat functionality coming soon!');
    alert('Chat-funksjonen kommer snart! Kontakt oss på e-post i mellomtiden.');
  };

  const handleBookMeeting = () => {
    navigate('/kontakt');
  };

  const handleViewMap = () => {
    window.open('https://www.google.com/maps/search/Kristiansand,+Norge', '_blank');
  };

  const handleBookConsultation = () => {
    navigate('/kontakt');
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Send E-post',
      info: 'agoras_norge@hotmail.com',
      description: 'Vi svarer innen 24 timer',
      action: 'Send E-post',
      color: 'from-blue-500 to-blue-600',
      onClick: handleSendEmail
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      info: 'Tilgjengelig daglig',
      description: 'Få umiddelbare svar',
      action: 'Start Chat',
      color: 'from-purple-500 to-purple-600',
      onClick: handleStartChat
    },
    {
      icon: Calendar,
      title: 'Book Møte',
      info: 'Gratis konsultasjon',
      description: '30 minutter personlig veiledning',
      action: 'Book Nå',
      color: 'from-orange-500 to-orange-600',
      onClick: handleBookMeeting
    },
    {
      icon: MapPin,
      title: 'Besøk Oss',
      info: 'Kristiansand, Norge',
      description: 'Sentralt lokalisert',
      action: 'Se Kart',
      color: 'from-green-500 to-green-600',
      onClick: handleViewMap
    }
  ];

  const faqs = [
    {
      question: 'Hvor mye koster undervisningen?',
      answer: 'Prisene varierer fra 450-650 kr/time avhengig av nivå. Vi tilbyr også pakkepriser for flere timer.'
    },
    {
      question: 'Hvor ofte anbefaler dere undervisning?',
      answer: 'Vi anbefaler vanligvis 1-2 timer per uke, men dette tilpasses elevens behov og mål.'
    },
    {
      question: 'Kan dere hjelpe med eksamensforberedelse?',
      answer: 'Ja, vi har omfattende erfaring med å forberede elever til alle typer matematikkeksamener.'
    },
    {
      question: 'Tilbyr dere online undervisning?',
      answer: 'Ja, vi tilbyr både fysisk og online undervisning med samme høye kvalitet.'
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
              Klar for å starte din matematikkreise? Vi er her for å hjelpe deg!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#741b1c] to-transparent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div 
                  key={index}
                  className={`text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={method.onClick}
                >
                  <div className={`bg-gradient-to-r ${method.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-[#741b1c] font-semibold mb-2">{method.info}</p>
                  <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                  <button className="text-[#741b1c] font-semibold hover:text-red-600 transition-colors">
                    {method.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
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

              <div className="bg-white">
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
              <div className="mt-8">
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ofte Stilte Spørsmål</h2>
            <p className="text-xl text-gray-600">
              Her finner du svar på de vanligste spørsmålene vi får
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

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Finn Oss</h2>
            <p className="text-xl text-gray-600">
              Vi holder til i Kristiansand med god tilgjengelighet
            </p>
          </div>

          <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-[#741b1c] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kristiansand</h3>
                <p className="text-gray-600">Norge</p>
                <button 
                  onClick={handleViewMap}
                  className="mt-4 bg-[#741b1c] text-white px-6 py-2 rounded-lg hover:bg-[#5a1415] transition-colors"
                >
                  Åpne i Kart
                </button>
              </div>
            </div>
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