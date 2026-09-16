import { Layout } from "@/components/layout/Layout";
import { Leaf, Heart, Award, Users } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Purity First",
    description: "We never compromise on ingredient quality. Every herb is carefully sourced and tested for purity.",
  },
  {
    icon: Heart,
    title: "Traditional Wisdom",
    description: "Our formulations are based on ancient Ayurvedic texts, perfected over thousands of years.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "GMP certified manufacturing with strict quality control at every stage of production.",
  },
  {
    icon: Users,
    title: "Customer Care",
    description: "We believe in building lasting relationships through genuine care and personalized service.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Our Story
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Bridging ancient Ayurvedic wisdom with modern wellness needs
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                Our Journey
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                From Traditional Roots to Modern Wellness
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Dinkar Ayurveda was born from a deep reverence for the ancient healing 
                  science of Ayurveda. Our journey began in the heart of Gujarat, where 
                  generations of Vaidyas (traditional healers) have practiced this sacred 
                  knowledge.
                </p>
                <p>
                  Founded by <strong className="text-foreground">Vaidya Niyati</strong>, 
                  a practitioner trained in classical Ayurvedic medicine, we started with 
                  a simple mission: to bring authentic, chemical-free Ayurvedic products 
                  to modern households.
                </p>
                <p>
                  Every product we create follows the authentic methods described in 
                  ancient texts like Charaka Samhita and Sushruta Samhita. We believe 
                  that true wellness comes from nature, and nature's wisdom is best 
                  preserved in its original form.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-secondary rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="text-8xl block mb-6">🙏</span>
                  <p className="font-serif text-2xl text-foreground mb-2">Vaidya Niyati</p>
                  <p className="text-muted-foreground">Founder & Chief Formulator</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Our Mission
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Making Ayurveda Accessible to All
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are committed to preserving the purity of Ayurvedic formulations while 
              making them accessible to modern consumers. Our products are crafted with 
              the same care and attention that traditional Vaidyas gave to their remedies, 
              using only the highest quality natural ingredients.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full mb-4">
              Our Values
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6 bg-card rounded-2xl shadow-soft border border-border/50">
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-video bg-secondary rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="text-6xl block mb-4">🏭</span>
                  <p className="font-serif text-xl text-foreground">GMP Certified Facility</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                Quality Assurance
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Manufacturing Standards
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Our manufacturing facility is GMP certified and follows the highest 
                  standards of hygiene and quality control. Every batch is tested for 
                  purity and potency before reaching your hands.
                </p>
                <ul className="space-y-2">
                  {[
                    "GMP Certified Manufacturing",
                    "Quality tested at every stage",
                    "Small batch production",
                    "No artificial preservatives",
                    "Eco-friendly packaging",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
