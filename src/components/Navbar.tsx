import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-maroon-dark via-maroon to-maroon-dark py-5 px-6 shadow-xl border-b border-gold/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="font-serif text-4xl text-primary-foreground font-bold tracking-wide hover:text-gold transition-colors drop-shadow-lg flex items-center gap-2">
          <span className="text-gold">✦</span>
          Shadiejo
          <span className="text-gold">✦</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link to="/venues" className="text-primary-foreground hover:text-gold transition-all font-medium relative group">
            Venues
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/inspiration" className="text-primary-foreground hover:text-gold transition-all font-medium relative group">
            Inspiration
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/vendors" className="text-primary-foreground hover:text-gold transition-all font-medium relative group">
            Vendors
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/blog" className="text-primary-foreground hover:text-gold transition-all font-medium relative group">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        <Button variant="outline" size="default" className="border-2 border-gold/50 text-primary-foreground hover:bg-gold hover:text-primary hover:border-gold transition-all shadow-lg font-semibold">
          Log In / Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
