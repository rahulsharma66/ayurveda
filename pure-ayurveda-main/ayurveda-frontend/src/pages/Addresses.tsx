import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { AddressDialog } from "@/components/addresses/AddressDialog";
import { apiRequest } from "@/lib/api";
import { MapPin, Trash2, CheckCircle2, Edit2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Addresses = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const { toast } = useToast();

  // --- NEW STATES FOR CUSTOM DELETE DIALOG ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAddresses = async () => {
    try {
      const data = await apiRequest("/auth/addresses", null, "GET");
      setAddresses(data);
    } catch (err) {
      console.error("Failed to fetch addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEditClick = (address: any) => {
    setSelectedAddress(address);
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedAddress(null);
    setIsDialogOpen(true);
  };

  // --- UPDATED DELETE HANDLERS ---
  const triggerDelete = (id: string) => {
    setAddressToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    setIsDeleting(true);
    try {
      await apiRequest(`/auth/address/${addressToDelete}`, null, "DELETE");
      toast({ title: "Address removed from sanctuary" });
      fetchAddresses();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete address" });
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setAddressToDelete(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 max-w-2xl px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">My Addresses</h1>
          <Button onClick={handleAddNewClick} className="bg-primary hover:bg-primary/90 rounded-xl h-12">
            + Add New
          </Button>
        </div>

        <div className="grid gap-4">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div key={addr._id} className="p-6 border rounded-3xl bg-card relative shadow-sm hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center mb-2">
                    <div className="p-2 rounded-full bg-primary/5">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-xl">{addr.firstName} {addr.lastName}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditClick(addr)} 
                      className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => triggerDelete(addr._id)} // Using triggerDelete now
                      className="text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1 text-muted-foreground ml-10">
                  <p className="text-lg leading-relaxed">{addr.fullAddress}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm font-medium text-foreground mt-3">Phone: {addr.phone}</p>
                </div>

                {addr.isDefault && (
                  <div className="mt-5 ml-10 flex items-center gap-2 text-primary font-bold text-xs bg-primary/5 w-fit px-4 py-1.5 rounded-full uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Default Shipping Address
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-[2rem] text-muted-foreground bg-muted/5">
              No addresses saved in your profile.
            </div>
          )}
        </div>
        
        {/* ADD/EDIT MODAL */}
        <AddressDialog 
          open={isDialogOpen} 
          onOpenChange={(open: boolean) => {
            setIsDialogOpen(open);
            if (!open) setSelectedAddress(null);
          }} 
          onSuccess={fetchAddresses} 
          initialData={selectedAddress} 
        />

        {/* --- CUSTOM DELETE CONFIRMATION DIALOG --- */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-[400px] rounded-[2rem] p-8 border-none shadow-elevated">
            <DialogHeader className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <DialogTitle className="text-2xl font-serif font-bold">Remove Address?</DialogTitle>
              <DialogDescription className="text-center text-lg text-muted-foreground">
                This will permanently delete this shipping location from your account. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-4 mt-6">
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-2xl text-lg font-medium border-border hover:bg-secondary" 
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Keep it
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-destructive/20" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Remove"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
};

export default Addresses;