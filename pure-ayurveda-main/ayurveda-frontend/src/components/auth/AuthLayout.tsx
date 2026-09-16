import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        
        {/* Floating leaves */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary-foreground/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Leaf className="w-8 h-8" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <motion.div
            className="p-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/20"
            whileHover={{ scale: 1.05 }}
          >
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <span className="font-serif text-3xl font-bold text-primary-foreground">
            Dinkar Ayurveda
          </span>
        </Link>

        {children}

        {/* Trust badges */}
        <motion.div 
          className="flex items-center justify-center gap-6 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: "🔒", label: "Secure" },
            { icon: "🌿", label: "Natural" },
            { icon: "✓", label: "Trusted" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-sm text-primary-foreground/60">
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}