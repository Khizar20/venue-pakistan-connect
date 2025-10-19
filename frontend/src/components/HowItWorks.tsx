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
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl mb-3 text-primary font-semibold">
            How It Works
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Get started with your venue search in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center group-hover:bg-beige transition-all duration-300 shadow-md relative">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-beige rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-xl mb-3 text-primary font-semibold">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
