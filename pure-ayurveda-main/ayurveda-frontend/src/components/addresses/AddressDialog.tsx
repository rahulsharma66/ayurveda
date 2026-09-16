import { useState, useEffect } from "react"; // Added useEffect
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INDIAN_STATES } from "@/constants/indianStates";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "10-digit phone is required"),
  fullAddress: z.string().min(5, "Address is required"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(6, "6-digit pincode is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

// Added 'initialData' prop to handle editing
export const AddressDialog = ({ open, onOpenChange, onSuccess, initialData }: any) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData; // Check if we are in Edit mode

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India", isDefault: false },
  });

  // Effect to populate form when initialData changes (when user clicks Edit)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ firstName: "", lastName: "", phone: "", fullAddress: "", city: "", pincode: "", state: "", country: "India", isDefault: false });
    }
  }, [initialData, reset, open]);

  const selectedState = watch("state");

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        // UPDATE Existing Address (PUT)
        await apiRequest(`/auth/address/${initialData._id}`, data, "PUT");
        toast({ title: "Address updated successfully" });
      } else {
        // ADD New Address (POST)
        await apiRequest("/auth/add-address", data, "POST"); 
        toast({ title: "Address added successfully" });
      }
      
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {isEditing ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>First Name</Label><Input {...register("firstName")} /></div>
            <div className="space-y-1"><Label>Last Name</Label><Input {...register("lastName")} /></div>
          </div>
          <div className="space-y-1"><Label>Phone Number</Label><Input type="tel" {...register("phone")} /></div>
          <div className="space-y-1"><Label>Full Address</Label><Input {...register("fullAddress")} /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>City</Label><Input {...register("city")} /></div>
            <div className="space-y-1"><Label>Pincode</Label><Input {...register("pincode")} maxLength={6} /></div>
          </div>
          
          <div className="space-y-1">
            <Label>State</Label>
            <Select onValueChange={(val) => setValue("state", val)} value={selectedState}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Select State" /></SelectTrigger>
              <SelectContent className="max-h-[200px]">{INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="isDefault" {...register("isDefault")} className="h-4 w-4" />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>
          
          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : isEditing ? "Update Address" : "Save Address"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};