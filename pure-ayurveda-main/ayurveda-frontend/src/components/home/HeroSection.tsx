import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    // CHANGE 1: Main background is now "primary" (Deep Forest Green)
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary">
      
      {/* --- BACKGROUND IMAGE LAYER --- */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/head-img.jpeg")', // Your image file
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* --- GRADIENT FADE LAYER --- */}
      {/* CHANGE 2: Gradient now fades from Dark Green (primary) to Transparent */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-primary/95 via-50% to-transparent" />

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Badge - Light background with light text */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full border border-primary-foreground/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">100% Natural & Ayurvedic</span>
            </div>

            {/* Heading - White Text (primary-foreground) */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground">
              Pure Ayurvedic <br />
              {/* Gold gradient text for emphasis */}
              <span className="text-gradient-gold">Wellness</span> Backed <br />
              by Tradition
            </h1>

            {/* Paragraph - Light text with slight opacity */}
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
              Discover the ancient wisdom of Ayurveda with our handcrafted products. 
              Made with 100% natural herbs and traditional formulations passed down 
              through generations.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/products">
                {/* Gold Button for Call to Action */}
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 text-base px-8 shadow-lg shadow-accent/20">
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                {/* Light Outline Button */}
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Trust Badges - White text */}
            <div className="flex flex-wrap items-center gap-6 pt-8">
              {[
                { label: "GMP Certified", icon: "✓" },
                { label: "100% Natural", icon: "🌿" },
                { label: "Ayush Approved", icon: "⚕" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-primary-foreground/80 font-medium">
                  <span className="w-6 h-6 rounded-full bg-primary-foreground/10 flex items-center justify-center text-xs border border-primary-foreground/20 text-primary-foreground">
                    {badge.icon}
                  </span>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Empty to let the image show through */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
};