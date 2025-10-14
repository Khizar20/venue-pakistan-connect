import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="font-serif text-4xl text-primary-foreground font-bold">
              Shadiejo
            </Link>
          </div>
          
          <div className="flex gap-8 mb-6 md:mb-0">
            <Link to="/about" className="text-primary-foreground hover:text-gold transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-primary-foreground hover:text-gold transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="text-primary-foreground hover:text-gold transition-colors">
              Privacy
            </Link>
          </div>
          
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-primary-foreground" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-primary-foreground" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-primary-foreground" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/70 text-sm">
          © 2025 Shadiejo. All rights reserved. Making your special day unforgettable.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
