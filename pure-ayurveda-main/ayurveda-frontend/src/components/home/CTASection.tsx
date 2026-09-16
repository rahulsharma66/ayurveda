import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-16">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-turmeric/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 leaf-pattern opacity-30" />

          <div className="relative z-10 max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Start Your Ayurvedic <br />
              <span className="text-gradient-gold">Wellness Journey</span> Today
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Experience the transformative power of authentic Ayurvedic products. 
              Connect with us on WhatsApp for personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 text-base px-8 w-full sm:w-auto">
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
