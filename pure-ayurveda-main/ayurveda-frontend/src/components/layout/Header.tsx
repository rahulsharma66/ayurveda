import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, Search } from "lucide-react";
import { products } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Ayurveda", path: "/ayurveda" },
  { name: "Contact", path: "/contact" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Search Logic
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    // Navigate to the product detail or products page with a filter
    navigate(`/products?id=${productId}`);
  };

  return (
    <>
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-20 md:h-28 border-b border-border">
                <div className="flex-1 max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search Ayurvedic remedies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-14 pl-14 pr-4 text-xl bg-secondary/50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="ml-4 p-2 hover:bg-secondary rounded-full"
                >
                  <X className="w-8 h-8 text-foreground" />
                </button>
              </div>

              {/* Results Area */}
              <div className="py-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {searchQuery ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="group text-left space-y-3 p-4 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all"
                        >
                          <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center text-5xl">
                            🌿
                          </div>
                          <h4 className="font-serif text-lg font-medium group-hover:text-primary">{product.shortName}</h4>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-primary font-bold">₹{product.variants[0].salePrice}</p>
                        </button>
                      ))
                    ) : (
                      <p className="col-span-full text-center text-muted-foreground py-20 text-lg">
                        No products match "{searchQuery}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-lg font-medium">Featured for You</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {products.filter(p => p.featured).slice(0, 4).map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="group p-4 rounded-2xl bg-card border border-border/50 hover:bg-secondary/30 text-left"
                        >
                          <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center text-4xl mb-3">
                            🌱
                          </div>
                          <p className="font-medium text-base line-clamp-1">{product.shortName}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 md:h-28">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-semibold text-primary">Dinkar</span>
                <span className="text-sm text-muted-foreground -mt-1 tracking-wider">AYURVEDA</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-2 text-lg font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-11 h-11 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                className="p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 border-t border-border bg-background animate-fade-in">
            <div className="flex flex-col gap-3 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-4 rounded-xl text-lg font-medium ${
                    isActive(link.path) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
};