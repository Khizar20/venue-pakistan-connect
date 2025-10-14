import { Search, Heart, Calendar } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Compare",
    description: "Explore hundreds of verified venues across Pakistan",
  },
  {
    icon: Heart,
    title: "Shortlist & Visit",
    description: "Save your favorites and schedule venue visits",
  },
  {
    icon: Calendar,
    title: "Book & Celebrate",
    description: "Secure your date and plan your perfect event",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/40 via-secondary/20 to-secondary/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(40_80%_55%/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(0_45%_20%/0.03),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <div className="h-1 w-16 bg-gold mx-auto rounded-full shadow-[0_0_15px_hsl(40_80%_55%/0.4)]" />
          </div>
          <h2 className="font-serif text-4xl md:text-6xl mb-4 text-primary">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Book your dream venue in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gold/50 to-transparent" />
              )}
              <div className="mb-8 flex justify-center relative">
                <div className="absolute -inset-4 bg-gold/10 rounded-full blur-xl group-hover:bg-gold/20 transition-all duration-500" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-maroon-dark to-maroon flex items-center justify-center group-hover:from-maroon to-gold transition-all duration-500 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 border-4 border-gold/20">
                  <step.icon className="w-14 h-14 text-primary-foreground drop-shadow-lg" />
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-3xl mb-4 text-primary group-hover:text-maroon transition-colors">{step.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
