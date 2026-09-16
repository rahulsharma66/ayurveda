import { Layout } from "@/components/layout/Layout";
import { Flame, Droplets, Wind, Leaf } from "lucide-react";

const doshas = [
  {
    name: "Vata",
    element: "Air + Space",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    qualities: "Light, dry, cold, mobile",
    characteristics: "Creative, quick-thinking, energetic when balanced. Anxiety and restlessness when imbalanced.",
  },
  {
    name: "Pitta",
    element: "Fire + Water",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    qualities: "Hot, sharp, liquid, oily",
    characteristics: "Intelligent, focused, ambitious when balanced. Irritability and inflammation when imbalanced.",
  },
  {
    name: "Kapha",
    element: "Earth + Water",
    icon: Droplets,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    qualities: "Heavy, slow, cool, stable",
    characteristics: "Calm, loving, grounded when balanced. Lethargy and weight gain when imbalanced.",
  },
];

const herbs = [
  { name: "Amla", benefits: "Vitamin C, immunity, hair health", sanskrit: "आमला" },
  { name: "Ashwagandha", benefits: "Stress relief, energy, strength", sanskrit: "अश्वगंधा" },
  { name: "Neem", benefits: "Skin health, blood purifier", sanskrit: "निम्ब" },
  { name: "Tulsi", benefits: "Respiratory health, immunity", sanskrit: "तुलसी" },
  { name: "Brahmi", benefits: "Memory, mental clarity", sanskrit: "ब्राह्मी" },
  { name: "Shatavari", benefits: "Women's health, vitality", sanskrit: "शतावरी" },
  { name: "Giloy", benefits: "Immunity, detoxification", sanskrit: "गिलोय" },
  { name: "Shikakai", benefits: "Hair care, natural cleanser", sanskrit: "शिकाकाई" },
];

const Ayurveda = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            The Science of Ayurveda
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Discover the ancient wisdom of life that has guided wellness for over 5,000 years
          </p>
        </div>
      </section>

      {/* What is Ayurveda */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Understanding Ayurveda
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              What is Ayurveda?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Ayurveda, meaning "Science of Life" in Sanskrit, is one of the world's oldest 
              holistic healing systems. Developed more than 5,000 years ago in India, it's 
              based on the belief that health and wellness depend on a delicate balance 
              between the mind, body, and spirit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { title: "आयुः", subtitle: "Ayus (Life)", desc: "Complete lifespan in its fullest expression" },
                { title: "वेदः", subtitle: "Veda (Knowledge)", desc: "Sacred wisdom passed through generations" },
                { title: "स्वास्थ्य", subtitle: "Swasthya (Health)", desc: "State of complete well-being" },
              ].map((item) => (
                <div key={item.subtitle} className="p-6 bg-card rounded-xl border border-border/50">
                  <p className="text-3xl font-serif text-primary mb-2">{item.title}</p>
                  <p className="font-semibold text-foreground mb-1">{item.subtitle}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doshas */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full mb-4">
              The Three Doshas
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Understanding Your Constitution
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              According to Ayurveda, each person has a unique combination of three bio-energies 
              called doshas, which determine our physical and mental characteristics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doshas.map((dosha) => (
              <div key={dosha.name} className="bg-card p-8 rounded-2xl shadow-card border border-border/50">
                <div className={`w-16 h-16 rounded-xl ${dosha.bgColor} flex items-center justify-center mb-6`}>
                  <dosha.icon className={`w-8 h-8 ${dosha.color}`} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  {dosha.name}
                </h3>
                <p className={`text-sm font-medium ${dosha.color} mb-4`}>
                  {dosha.element}
                </p>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Qualities:</p>
                    <p className="text-muted-foreground">{dosha.qualities}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Characteristics:</p>
                    <p className="text-muted-foreground">{dosha.characteristics}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Herb Glossary */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Herbal Wisdom
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ayurvedic Herb Glossary
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn about the powerful herbs used in our formulations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {herbs.map((herb) => (
              <div key={herb.name} className="p-5 bg-card rounded-xl border border-border/50 hover:shadow-card transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{herb.name}</p>
                    <p className="text-xs text-primary">{herb.sanskrit}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{herb.benefits}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Lifestyle Benefits
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Benefits of an Ayurvedic Lifestyle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {[
                "Improved digestion and metabolism",
                "Enhanced immunity and vitality",
                "Better mental clarity and focus",
                "Reduced stress and anxiety",
                "Balanced energy throughout the day",
                "Healthier skin and hair",
                "Better sleep quality",
                "Natural detoxification",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-4 bg-card rounded-lg">
                  <span className="w-2 h-2 bg-accent rounded-full shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ayurveda;
