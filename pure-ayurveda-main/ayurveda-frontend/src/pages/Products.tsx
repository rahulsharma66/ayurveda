import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { getProducts, getCategories } from "@/lib/api";

const Products = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);

        setProducts(productsData);

        if (categoriesData && categoriesData.length > 0) {
          const categoryNames = categoriesData.map((cat: any) => cat.name);
          setCategories(["All", ...categoryNames]);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  const getSelectedVariant = (product: any) => {
    if (!product.variants || product.variants.length === 0) {
      return { salePrice: product.price || 0, mrp: product.price || 0, size: "Standard" };
    }
    return product.variants[selectedVariants[product._id || product.id] || 0];
  };

  const getProductBuyLinks = (product: any) => {
    const links = (product.platformLinks || [])
      .filter((l: any) => l?.url)
      .map((l: any) => ({ platform: (l.platform || "Buy").trim(), url: l.url }));
    if (links.length === 0 && product.meeshoLink) {
      links.push({ platform: "Meesho", url: product.meeshoLink });
    }
    return links;
  };

  const openLink = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Our Products
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Handcrafted Ayurvedic products made with pure, natural ingredients
            and traditional formulations — ordered directly via Meesho.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">

          {/* Dynamic Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "bg-primary text-primary-foreground" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
             <div className="text-center py-12 text-muted-foreground">
               Loading products...
             </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
             <div className="text-center py-12 text-muted-foreground">
               No products found in this category.
             </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProducts.map((product) => {
                const selectedVariant = getSelectedVariant(product);
                const productId = product._id || product.id;

                return (
                  <div
                    key={productId}
                    onClick={() => navigate(`/products/${productId}`)}
                    className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="grid md:grid-cols-2">

                      {/* Dynamic Image */}
                      <div className="aspect-square bg-secondary relative overflow-hidden flex items-center justify-center group">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <span className="text-7xl block mb-4">🌿</span>
                            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                              {product.category || "General"}
                            </span>
                          </div>
                        )}

                        {/* Category Badge */}
                        {product.images && product.images.length > 0 && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full shadow-sm">
                              {product.category || "General"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col justify-center">
                        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                          {product.shortName || product.name}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Variants Selection */}
                        {product.variants && product.variants.length > 1 && (
                          <div className="flex gap-2 mb-4">
                            {product.variants.map((variant: any, index: number) => (
                              <button
                                key={variant.size}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedVariants(prev => ({ ...prev, [productId]: index }));
                                }}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                  (selectedVariants[productId] || 0) === index
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border text-muted-foreground hover:border-primary/50"
                                }`}
                              >
                                {variant.size}
                              </button>
                            ))}
                          </div>
                        )}

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

                        {/* Buy Links (Meesho / Flipkart / Amazon / etc.) */}
                        {(() => {
                          const buyLinks = getProductBuyLinks(product);
                          return (
                            <div onClick={(e) => e.stopPropagation()} className="space-y-2">
                              {buyLinks.length > 0 ? (
                                buyLinks.map((link: any, i: number) => (
                                  <Button
                                    key={i}
                                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                                    onClick={(e) => openLink(link.url, e)}
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Buy on {link.platform}
                                  </Button>
                                ))
                              ) : (
                                <Button
                                  className="w-full gap-2"
                                  variant="outline"
                                  onClick={(e) => { e.stopPropagation(); navigate(`/products/${productId}`); }}
                                >
                                  View Product
                                </Button>
                              )}
                            </div>
                          );
                        })()}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;