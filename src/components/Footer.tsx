import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-maroon-dark via-maroon to-maroon-dark py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(40_80%_55%/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(40_80%_55%/0.08),transparent_50%)]" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="font-serif text-5xl text-primary-foreground font-bold hover:text-gold transition-colors drop-shadow-lg flex items-center gap-2">
              <span className="text-gold text-3xl">✦</span>
              Shadiejo
              <span className="text-gold text-3xl">✦</span>
            </Link>
            <p className="text-primary-foreground/70 mt-2 text-sm">Making your special day unforgettable</p>
          </div>
          
          <div className="flex gap-10 mb-8 md:mb-0">
            <Link to="/about" className="text-primary-foreground hover:text-gold transition-all font-medium relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/contact" className="text-primary-foreground hover:text-gold transition-all font-medium relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/privacy" className="text-primary-foreground hover:text-gold transition-all font-medium relative group">
              Privacy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          
          <div className="flex gap-5">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gold/10 hover:bg-gold border-2 border-gold/20 hover:border-gold flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-primary-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gold/10 hover:bg-gold border-2 border-gold/20 hover:border-gold flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-primary-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gold/10 hover:bg-gold border-2 border-gold/20 hover:border-gold flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-primary-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gold/20 text-center">
          <p className="text-primary-foreground/80 text-sm">
            © 2025 Shadiejo. All rights reserved.
          </p>
          <p className="text-gold/60 text-xs mt-2">
            Pakistan's Premier Wedding Venue Booking Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
