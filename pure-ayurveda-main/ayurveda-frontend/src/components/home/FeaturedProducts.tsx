import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { products } from "@/data/products";

export const FeaturedProducts = () => {
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full mb-4">
              Our Bestsellers
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Featured Products
            </h2>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 border border-border/50"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
                  <span className="text-6xl">🌿</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.shortName}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ₹{product.variants[0].salePrice}
                  </span>
                  {product.variants[0].mrp !== product.variants[0].salePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.variants[0].mrp}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    / {product.variants[0].size}
                  </span>
                </div>

                {/* CTA */}
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
