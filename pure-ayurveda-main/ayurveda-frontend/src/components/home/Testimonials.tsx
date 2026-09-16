import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The Chyawanprash has been a game-changer for my family's health. My kids love the taste and haven't fallen sick since we started using it!",
    product: "Chyawanprash",
  },
  {
    name: "Rajesh Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "I've struggled with eczema for years. Shat Dhaut Ghrita has given me relief like no other product. Truly magical Ayurvedic remedy!",
    product: "Shat Dhaut Ghrita",
  },
  {
    name: "Ananya Gupta",
    location: "Delhi",
    rating: 5,
    text: "Finally found a shampoo that doesn't contain harsh chemicals! My hair feels so much healthier and the hair fall has reduced significantly.",
    product: "Herbal Shampoo",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Real stories from real people who've experienced the power of Ayurveda
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card p-6 md:p-8 rounded-2xl shadow-soft border border-border/50"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Quote className="w-5 h-5 text-accent-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-lg text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>

              {/* Product Badge */}
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">Purchased: </span>
                <span className="text-xs font-medium text-primary">{testimonial.product}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
