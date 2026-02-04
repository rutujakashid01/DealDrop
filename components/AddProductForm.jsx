"use client";

import { useState } from "react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import AuthModal from "./Authmodal";
import { addProduct } from "@/app/action";
import { toast } from "sonner";






export default function AddProductForm ({user}) {
  const [url, setUrl] =useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to add a product");
      setShowAuthModal(true);
      return;
    }
    setLoading (true);
    try {
    const formData = new FormData();
    formData.append("url", url);

    const result = await addProduct(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(
        `Product ${result.isUpdate ? "updated" : "added"} successfully!`
      );
      setUrl("");
    }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
    setLoading(false);
    }


  };

  return (
    <>
    <form onSubmit={handleSubmit}  className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 pb-10">
        <Input  
        type="url" placeholder="Paste product URL here (e.g., Amazon, eBay, Walmart)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="h-12 text-base "
        required
        disabled={loading}
        />
        <Button className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"
        type="submit"
        disabled={loading}
        size={"lg"}
        >
          {loading ?(
            <>
            <Loader2 className="animate-spin mr-2 h-4 w-4"/>
            Adding...
            </>
          ) : (
            "Track Price"
          )}
        </Button>
      </div>
    </form>

    {/*Auth Model*/}
    <AuthModal
    isOpen={showAuthModal}
    onClose={() => setShowAuthModal(false)}
    />
  </>  
    
      

    
  );
};


