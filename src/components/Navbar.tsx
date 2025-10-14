import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-primary py-4 px-6 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-primary/95">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="font-serif text-3xl text-primary-foreground font-semibold tracking-wide hover:text-gold transition-colors">
          Shadiejo
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/venues" className="text-primary-foreground hover:text-gold transition-all text-sm font-medium relative group">
            Venues
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/inspiration" className="text-primary-foreground hover:text-gold transition-all text-sm font-medium relative group">
            Inspiration
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/vendors" className="text-primary-foreground hover:text-gold transition-all text-sm font-medium relative group">
            Vendors
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/blog" className="text-primary-foreground hover:text-gold transition-all text-sm font-medium relative group">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        <Button variant="outline" size="sm" className="border-2 border-gold text-primary-foreground hover:bg-gold hover:text-primary hover:border-gold transition-all font-medium text-sm">
          Log In / Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
