
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { createItem } from "@/services/itemService";
import { ItemFormData, ItemType } from "@/types";

interface ItemFormProps {
  type: ItemType;
  title: string;
}

const ItemForm = ({ type, title }: ItemFormProps) => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    category: "electronics",
    location: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    image: null,
    contactInfo: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in to report an item");
      return;
    }

    // Form validation
    if (
      !formData.name ||
      !formData.category ||
      !formData.location ||
      !formData.date ||
      !formData.description ||
      !formData.contactInfo
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createItem(formData, type, currentUser.id, currentUser.name);
      toast.success(
        `Your ${type} item has been reported successfully!`,
        {
          description: "You can view it in your dashboard.",
        }
      );
      navigate(type === "lost" ? "/lost-items" : "/found-items");
    } catch (error) {
      toast.error(
        "Failed to submit your report",
        {
          description: "Please try again later.",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name*</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Blue Backpack, iPhone 13, Student ID Card"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category*</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="keys">Keys</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location*</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Library, Student Union, Science Building"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date*</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={`Please provide details about the ${type} item...`}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex flex-col space-y-2">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-[200px] object-contain rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, image: null }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
              <p className="text-xs text-slate-500">
                Upload an image of the {type} item to help with identification.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information*</Label>
            <Input
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Email or phone number"
              required
            />
            <p className="text-xs text-slate-500">
              This will be visible to other users who may have {type === "lost" ? "found" : "lost"} your item.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-campus-blue hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ItemForm;
