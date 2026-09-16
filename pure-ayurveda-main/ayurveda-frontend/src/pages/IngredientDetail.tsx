import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout"; // Lowercase 'l' for layout folder
import { ChevronLeft, Leaf } from "lucide-react";
import { getIngredientByName } from "@/lib/api"; // Importing our new specific function

const IngredientDetail = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchIngredient = async () => {
      try {
        if (name) {
          const data = await getIngredientByName(name);
          setIngredient(data); 
        }
      } catch (error) {
        console.error("Failed to load ingredient", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredient();
  }, [name]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground text-lg animate-pulse font-medium">
          Unearthing botanical secrets...
        </div>
      </Layout>
    );
  }

  if (!ingredient) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Ingredient Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find details for "{name}".</p>
          <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/50 border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Product
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 md:py-24 bg-background min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-border/50 flex flex-col items-center text-center transition-all hover:shadow-2xl">
            
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 shadow-inner border border-primary/20">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              {ingredient.name}
            </h1>
            
            <div className="w-16 h-1.5 bg-primary/30 rounded-full mb-10"></div>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
              {ingredient.description}
            </p>
            
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IngredientDetail;