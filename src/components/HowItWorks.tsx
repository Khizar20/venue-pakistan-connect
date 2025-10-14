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
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 text-primary">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center group-hover:bg-maroon-light transition-all duration-300 shadow-lg group-hover:shadow-xl transform group-hover:scale-110">
                  <step.icon className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-serif text-2xl mb-4 text-primary">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
