import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-primary py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="font-serif text-3xl text-primary-foreground font-bold tracking-wide">
          Shadiejo
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/venues" className="text-primary-foreground hover:text-gold transition-colors">
            Venues
          </Link>
          <Link to="/inspiration" className="text-primary-foreground hover:text-gold transition-colors">
            Inspiration
          </Link>
          <Link to="/vendors" className="text-primary-foreground hover:text-gold transition-colors">
            Vendors
          </Link>
          <Link to="/blog" className="text-primary-foreground hover:text-gold transition-colors">
            Blog
          </Link>
        </div>

        <Button variant="outline" size="default" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
          Log In / Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
