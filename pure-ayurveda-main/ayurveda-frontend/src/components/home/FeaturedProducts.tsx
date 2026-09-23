import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getProducts } from "@/lib/api";

const getBuyLinks = (product: any) => {
  const links = (product.platformLinks || [])
    .filter((l: any) => l?.url)
    .map((l: any) => ({ platform: (l.platform || "Buy").trim(), url: l.url }));
  if (links.length === 0 && product.meeshoLink) {
    links.push({ platform: "Meesho", url: product.meeshoLink });
  }
  return links;
};

export const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [featuredProductList, setFeaturedProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setFeaturedProductList((data || []).filter((p: any) => p.featured));
      } catch (error) {
        console.error("Failed to load featured products", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return null;
  if (featuredProductList.length === 0) return null;

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
          {featuredProductList.map((product) => {
            const productId = product._id || product.id;
            const selectedVariant = product.variants && product.variants.length > 0
              ? product.variants[0]
              : { salePrice: product.price || 0, mrp: product.price || 0, size: "Standard" };
            const buyLinks = getBuyLinks(product);

            return (
              <div
                key={productId}
                onClick={() => navigate(`/products/${productId}`)}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 border border-border/50 cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-square bg-secondary overflow-hidden flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-6xl">🌿</span>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.shortName || product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-primary">
                      ₹{selectedVariant.salePrice}
                    </span>
                    {selectedVariant.mrp && selectedVariant.mrp !== selectedVariant.salePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{selectedVariant.mrp}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      / {selectedVariant.size}
                    </span>
                  </div>

                  {/* Buy Links */}
                  <div onClick={(e) => e.stopPropagation()}>
                    {buyLinks.length > 0 ? (
                      buyLinks.map((link: any, i: number) => (
                        <Button
                          key={i}
                          className="w-full gap-2 mb-2 bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(link.url, "_blank", "noopener,noreferrer");
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Buy on {link.platform}
                        </Button>
                      ))
                    ) : (
                      <Button className="w-full gap-2" variant="outline" onClick={() => navigate(`/products/${productId}`)}>
                        View Product
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};