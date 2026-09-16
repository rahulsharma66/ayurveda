import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ShoppingBag, Star, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { getProductById } from "@/lib/api"; 

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); 
  
  const { addToCart, items, updateQuantity } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data?.product ? data.product : data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product?.images?.length) {
      setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product?.images?.length) {
      setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground text-lg">
          Loading product details...
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products"><Button>Back to Products</Button></Link>
        </div>
      </Layout>
    );
  }

  const variants = product?.variants?.length > 0 
    ? product.variants 
    : [{ size: "Standard", salePrice: product?.price || 0, mrp: product?.price || 0 }];
  
  const selectedVariant = variants[selectedVariantIndex];
  const productId = product?._id || id;
  const cartItem = (items || []).find((i: any) => i.productId === productId && i.size === selectedVariant?.size);

  return (
    <Layout>
      <div className="bg-secondary/50 border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>

      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* --- IMAGE GALLERY --- */}
<div className="md:col-span-5 flex flex-col gap-4">
  
  {/* Main Image Box */}
  <div className="relative aspect-square bg-white rounded-2xl overflow-hidden group flex items-center justify-center">
    {product?.images && product.images.length > 0 ? (
      <>
        <img
          src={product.images[selectedImageIndex]}
          alt={product?.name}
          className="max-w-full max-h-full object-contain"
        />

        {/* Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-primary hover:text-white text-foreground p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-primary hover:text-white text-foreground p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </>
    ) : (
      <span className="text-9xl">🌿</span>
    )}

    {product?.category && (
      <span className="absolute top-4 left-4 px-4 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-sm">
        {product.category}
      </span>
    )}
  </div>

  {/* Thumbnails */}
  {product?.images && product.images.length > 1 && (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {product.images.map((img: string, index: number) => (
        <button
          key={index}
          onClick={() => setSelectedImageIndex(index)}
          className={`relative w-20 h-20 bg-white rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
            selectedImageIndex === index
              ? "border-primary"
              : "border-transparent opacity-60 hover:opacity-100"
          }`}
        >
          <img
            src={img}
            className="max-w-full max-h-full object-contain"
          />
        </button>
      ))}
    </div>
  )}
</div>

            {/* --- DETAILS SECTION --- */}
            <div className="md:col-span-7 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                {product?.name}
              </h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {product?.longDescription || product?.description}
              </p>

              {/* Variants */}
              {variants.length > 1 && (
                <div className="mb-6">
                  <span className="text-sm font-semibold text-foreground mb-3 block">Size</span>
                  <div className="flex gap-2 flex-wrap">
                    {variants.map((variant: any, index: number) => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`px-5 py-2 text-sm rounded-lg border transition-all ${
                          selectedVariantIndex === index
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold text-primary">₹{selectedVariant?.salePrice}</span>
                {selectedVariant?.mrp && selectedVariant.mrp !== selectedVariant.salePrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{selectedVariant.mrp}</span>
                )}
                <span className="text-sm text-muted-foreground">/ {selectedVariant?.size}</span>
              </div>

              {/* Add to Cart */}
              <div className="mb-10 max-w-xs">
                {cartItem ? (
                  <div className="w-full flex items-center rounded-lg border border-primary overflow-hidden">
                    <button className="flex-1 h-12 flex items-center justify-center bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors" onClick={() => updateQuantity(productId, selectedVariant.size, cartItem.quantity - 1)}>−</button>
                    <span className="flex-[2] h-12 flex items-center justify-center font-bold bg-background">{cartItem.quantity}</span>
                    <button className="flex-1 h-12 flex items-center justify-center bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors" onClick={() => updateQuantity(productId, selectedVariant.size, cartItem.quantity + 1)}>+</button>
                  </div>
                ) : (
                  <Button
                    className="w-full gap-2 bg-primary hover:bg-primary/90 h-12 text-base font-bold shadow-md"
                    onClick={() => {
                      addToCart({
                        productId: productId,
                        productName: product?.name,
                        shortName: product?.shortName || product?.name,
                        category: product?.category || "General",
                        size: selectedVariant?.size || "Standard",
                        mrp: selectedVariant?.mrp || selectedVariant?.salePrice,
                        salePrice: selectedVariant?.salePrice,
                        image: product?.images?.[0] || "",
                      });
                      toast({ title: "Added to Bag", description: `${product?.name} added.` });
                    }}
                  ><ShoppingBag className="w-5 h-5" /> Add to Cart</Button>
                )}
              </div>

              {/* Details Info */}
              <div className="space-y-8 pt-6 border-t border-border/50">
                {product?.benefits?.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-3 underline decoration-accent decoration-2 underline-offset-4">Benefits</h3>
                    <div className="space-y-2">
                      {product.benefits.map((benefit: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-neem mt-0.5 shrink-0" />
                          <span className="text-muted-foreground font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

               {/* NEW CODE (Clickable Links) */}
                {product?.ingredients?.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-3 underline decoration-accent decoration-2 underline-offset-4">Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ingredient: string, i: number) => (
                        <Link 
                          key={i} 
                          to={`/ingredient/${ingredient}`}
                          className="px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full border border-primary/20 hover:bg-primary hover:text-white hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 transform hover:-translate-y-0.5"
                        >
                          🌿 {ingredient}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {product?.usage?.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-3 underline decoration-accent decoration-2 underline-offset-4">How to Use</h3>
                    <ol className="space-y-3">
                      {product.usage.map((step: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground font-medium leading-relaxed">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black shrink-0">{i+1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;