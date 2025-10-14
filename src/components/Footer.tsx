import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          <div>
            <Link to="/" className="font-serif text-3xl text-primary-foreground font-semibold hover:text-gold transition-colors">
              Shadiejo
            </Link>
            <p className="text-primary-foreground/70 mt-2 text-sm max-w-xs">
              Making your special day unforgettable
            </p>
          </div>
          
          <div className="flex gap-8">
            <Link to="/about" className="text-primary-foreground hover:text-gold transition-all text-sm font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-primary-foreground hover:text-gold transition-all text-sm font-medium">
              Contact
            </Link>
            <Link to="/privacy" className="text-primary-foreground hover:text-gold transition-all text-sm font-medium">
              Privacy
            </Link>
          </div>
          
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all duration-300 group"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-primary-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all duration-300 group"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-primary-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all duration-300 group"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-primary-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-primary-foreground/60 text-xs">
            © 2025 Shadiejo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
