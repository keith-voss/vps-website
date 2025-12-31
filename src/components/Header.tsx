import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo-voss.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
  onOpenEstimate: () => void;
}

const Header = ({ onOpenEstimate }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Voss Property Solutions" className="h-[63px] w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <nav className="flex items-center gap-1 bg-industrial-black/5 rounded-full p-1 pl-6 pr-1 border border-black/5 backdrop-blur-sm">
              <Link to="/" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>

              <div className="flex items-center gap-0.5 px-4 py-2">
                <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                  About
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center p-1 text-sm font-medium hover:text-primary transition-colors outline-none">
                    <ChevronDown className="w-4 h-4 ml-0.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link to="/locations" className="w-full">Locations</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-0.5 px-4 py-2">
                <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">
                  Services
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center p-1 text-sm font-medium hover:text-primary transition-colors outline-none">
                    <ChevronDown className="w-4 h-4 ml-0.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link to="/projects" className="w-full">Our Work</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link to="/blog" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <a href="mailto:keith@vosspropertysolutions.com" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors mr-2">
                Contact
              </a>
            </nav>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-6 ml-auto">

            <Button
              variant="cta"
              size="lg"
              onClick={() => window.open('https://clienthub.getjobber.com/hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/requests/2123840/new', '_blank')}
              className="hidden sm:flex"
            >
              Free Estimate
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-left py-2 font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <div className="flex flex-col gap-2">
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-left py-2 font-medium hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/locations" onClick={() => setIsMobileMenuOpen(false)} className="text-left py-2 pl-4 text-sm hover:text-primary transition-colors">
                  Locations
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-left py-2 font-medium hover:text-primary transition-colors">
                  Services
                </Link>
                <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)} className="text-left py-2 pl-4 text-sm hover:text-primary transition-colors">
                  Our Work (Projects)
                </Link>
              </div>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-left py-2 font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <a href="mailto:keith@vosspropertysolutions.com" className="text-left py-2 font-medium hover:text-primary transition-colors">
                Contact
              </a>
              <Button variant="cta" size="lg" onClick={() => window.open('https://clienthub.getjobber.com/hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/requests/2123840/new', '_blank')} className="w-full mt-2">
                Free Estimate
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
