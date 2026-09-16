import { Leaf, Shield, Heart, Award, Droplets, Sun } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Pure herbs and botanicals sourced from organic farms across India",
  },
  {
    icon: Shield,
    title: "Chemical Free",
    description: "No parabens, SLS, artificial colors, or harmful chemicals",
  },
  {
    icon: Heart,
    title: "Traditional Formulas",
    description: "Ancient Vedic recipes passed down through generations",
  },
  {
    icon: Award,
    title: "Quality Certified",
    description: "GMP certified manufacturing with strict quality control",
  },
  {
    icon: Droplets,
    title: "Handcrafted",
    description: "Made in small batches with attention to detail and care",
  },
  {
    icon: Sun,
    title: "Holistic Wellness",
    description: "Products that nurture body, mind, and spirit together",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-nature">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Dinkar Ayurveda Difference
          </h2>
          <p className="text-muted-foreground text-lg">
            We blend ancient Ayurvedic wisdom with modern quality standards to bring 
            you products that truly work.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 md:p-8 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
