import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    value: "+91 98765 43210",
    action: "tel:+919876543210",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@dinkarayurveda.com",
    action: "mailto:info@dinkarayurveda.com",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "Ayurvedic Wellness Center, Gujarat, India",
    action: "#",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Mon - Sat: 9:00 AM - 7:00 PM",
    action: "#",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                  Get in Touch
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  We're Here to Help
                </h2>
                <p className="text-muted-foreground">
                  Whether you have questions about our products, need personalized 
                  recommendations, or want to learn more about Ayurveda, our team is 
                  ready to assist you.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.action}
                    className="p-5 bg-card rounded-xl border border-border/50 hover:shadow-card transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">{info.title}</p>
                    <p className="text-sm text-muted-foreground">{info.value}</p>
                  </a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="p-6 bg-neem/10 rounded-2xl border border-neem/20">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-neem/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-7 h-7 text-neem" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      Chat on WhatsApp
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Get instant responses and personalized product recommendations 
                      from our Ayurvedic experts.
                    </p>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-neem hover:bg-neem/90 gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Start Chat
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 rounded-2xl shadow-card border border-border/50">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Message
                  </label>
                  <Textarea
                    placeholder="How can we help you?"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full mb-4">
              FAQ
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 text-left">
              {[
                {
                  q: "Are your products 100% chemical-free?",
                  a: "Yes, all our products are made with natural ingredients without any parabens, SLS, artificial colors, or harmful chemicals.",
                },
                {
                  q: "Is it safe for children?",
                  a: "Most of our products are safe for children above 5 years. Please check individual product descriptions for specific age recommendations.",
                },
                {
                  q: "Do you ship pan India?",
                  a: "Yes, we deliver to all major cities and towns across India. Delivery typically takes 5-7 business days.",
                },
                {
                  q: "How long until I see results?",
                  a: "Ayurvedic products work holistically. While some effects may be immediate, optimal results are typically seen with consistent use over 4-8 weeks.",
                },
              ].map((faq, index) => (
                <div key={index} className="p-5 bg-card rounded-xl border border-border/50">
                  <p className="font-semibold text-foreground mb-2">{faq.q}</p>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
