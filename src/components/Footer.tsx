import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/Logo Upscaled.png" 
                  alt="Agoras Logo" 
                  className="w-6 h-6 object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Agoras</h3>
                <p className="text-sm text-gray-400">Privat Matematikkundervisning</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Vi hjelper elever fra Ungdomsskole til R2 med å mestre matematikk gjennom 
              personlig tilpasset undervisning og beviselige resultater.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>agoras_norge@hotmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Kristiansand, Norge</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Snarveier</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-[#741b1c] transition-colors">Hjem</Link></li>
              <li><Link to="/kurs" className="hover:text-[#741b1c] transition-colors">Våre Kurs</Link></li>
              <li><Link to="/om-oss" className="hover:text-[#741b1c] transition-colors">Om Oss</Link></li>
              <li><Link to="/kontakt" className="hover:text-[#741b1c] transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Tjenester</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Ungdomsskole (8.-10. trinn)</li>
              <li>Videregående (Vg1-Vg3)</li>
              <li>R1 & R2</li>
              <li>Eksamensforberedelse</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Agoras. Alle rettigheter reservert.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#741b1c] transition-colors text-sm">
              Personvern
            </a>
            <a href="#" className="text-gray-400 hover:text-[#741b1c] transition-colors text-sm">
              Vilkår
            </a>
            <a href="#" className="text-gray-400 hover:text-[#741b1c] transition-colors text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;