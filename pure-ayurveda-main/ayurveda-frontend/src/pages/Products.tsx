import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. <-- IMPORTED useNavigate
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Check } from "lucide-react";
import { getProducts, getCategories } from "@/lib/api"; 
import { useCart } from "@/context/CartContext"; 
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const navigate = useNavigate(); // 2. <-- INITIALIZED navigate
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  const { addToCart, items, updateQuantity } = useCart();
  const { toast } = useToast();

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
            and traditional formulations.
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
                  // 3. <-- ADDED onClick AND cursor-pointer TO THIS DIV
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
                      <div className="p-6 md:p-8 flex flex-col">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                        </div>

                        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                          {product.shortName || product.name}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-4">
                          {product.description}
                        </p>

                        {/* Benefits */}
                        {product.benefits && product.benefits.length > 0 && (
                          <div className="space-y-1.5 mb-4 flex-1">
                            {product.benefits.slice(0, 4).map((benefit: string, i: number) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-neem mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Variants Selection */}
                        {product.variants && product.variants.length > 1 && (
                          <div className="flex gap-2 mb-4">
                            {product.variants.map((variant: any, index: number) => (
                              <button
                                key={variant.size}
                                // 4. <-- ADDED e.stopPropagation() TO STOP BUTTON FROM TRIGGERING CARD CLICK
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
                        <div className="flex items-center gap-2 mb-4 mt-auto">
                          <span className="text-2xl font-bold text-primary">
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

                        {/* CTA / Cart Quantity Toggle */}
                        {/* 5. <-- WRAPPED CART BUTTONS TO PREVENT CLICKS FROM TRIGGERING PAGE NAVIGATION */}
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                          {(() => {
                            const cartItem = items.find(
                              (i) => i.productId === productId && i.size === selectedVariant.size
                            );
                            
                            if (cartItem) {
                              return (
                                <div className="w-full flex items-center rounded-lg border border-primary overflow-hidden">
                                  <button
                                    className="flex-1 h-10 flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
                                    onClick={() => updateQuantity(productId, selectedVariant.size, cartItem.quantity - 1)}
                                  >
                                    −
                                  </button>
                                  <span className="flex-[2] h-10 flex items-center justify-center text-foreground font-semibold text-base bg-background">
                                    {cartItem.quantity}
                                  </span>
                                  <button
                                    className="flex-1 h-10 flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
                                    onClick={() => updateQuantity(productId, selectedVariant.size, cartItem.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <Button
                                className="w-full gap-2 bg-primary hover:bg-primary/90"
                                onClick={() => {
                                  addToCart({
                                    productId: productId,
                                    productName: product.name,
                                    shortName: product.shortName || product.name,
                                    category: product.category || "General",
                                    size: selectedVariant.size,
                                    mrp: selectedVariant.mrp || selectedVariant.salePrice,
                                    salePrice: selectedVariant.salePrice,
                                    image: product.images && product.images.length > 0 ? product.images[0] : "",
                                  });
                                  toast({
                                    title: "Added to cart!",
                                    description: `${product.shortName || product.name} (${selectedVariant.size}) added.`,
                                  });
                                }}
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart
                              </Button>
                            );
                          })()}
                        </div>
                        
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