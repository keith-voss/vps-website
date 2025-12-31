
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ShieldCheck } from "lucide-react";
import logo from "@/assets/voss-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-industrial-black text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">

          {/* Logo & Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link to="/" className="inline-block">
                <img src={logo} alt="Voss Property Solutions" className="h-8 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-background/60 text-sm">
              Professional pavement marking and warehouse safety solutions. Owner-operated with 35+ years of experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <nav className="flex flex-col items-center justify-center gap-4 text-sm">
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/" className="text-background/60 hover:text-primary transition-colors">Home</Link>
                <Link to="/about" className="text-background/60 hover:text-primary transition-colors">About</Link>
                <Link to="/services" className="text-background/60 hover:text-primary transition-colors">Services</Link>
                <a href="mailto:keith@vosspropertysolutions.com" className="text-background/60 hover:text-primary transition-colors">Contact</a>
              </div>
            </nav>
          </div>

          {/* Social Media */}
          <div className="flex justify-end gap-4">
            <a
              href="http://facebook.com/vosspropertysolutions"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-primary p-3 rounded-full transition-colors group"
            >
              <Facebook className="w-5 h-5 text-white group-hover:text-industrial-black" />
            </a>
            <a
              href="http://instagram.com/line_striper"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-primary p-3 rounded-full transition-colors group"
            >
              <Instagram className="w-5 h-5 text-white group-hover:text-industrial-black" />
            </a>
            <a
              href="https://www.linkedin.com/company/voss-property-solutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-primary p-3 rounded-full transition-colors group"
            >
              <Linkedin className="w-5 h-5 text-white group-hover:text-industrial-black" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/10 text-center flex flex-col md:flex-row justify-between items-center text-xs text-background/40 gap-4">
          <p>&copy; {currentYear} Voss Property Solutions. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span>Licensed & Insured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
