"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { scrapeProduct } from "@/lib/firecrawl";

// Sign out action
export async function signOut(){
    const supabase= await createClient();
    await supabase.auth.signOut();
    revalidatePath("/");
    redirect("/");
}

export async function addProduct(formData) {
    const url = formData.get("url");

    if (!url) {
        return { error: "URL is required" };
    }

    try {
        const supabase = await createClient();
        const {data:
            { user } ,} = await supabase.auth.getUser();
        

        if (!user) {
            return { error: "User not authenticated" };
        }
        //scrape product data with firecrawl
        const productData = await scrapeProduct(url);

        if (!productData.name || !productData.current_price) {
            console.log (productData,"productData");
            return { error: "Failed to extract product data" };
        }

        const newPrice = parseFloat(productData.current_price);
        const currency = productData.currency || "USD";

        const{data: existingProduct}= await supabase
        .from("products")
        .select("id,current_price")
        .eq("url", url)
        .eq("user_id", user.id)
        .single();

        const isUpdate = !!existingProduct;

        //Upsert product (insert or update based on user_id and url)
        const {data: product, error} = await supabase.from("products").upsert({
            user_id: user.id,
            url,
            name: productData.name, // FIXED: Changed from productname to name
            current_price: newPrice,
            currency: currency,
            image_url: productData.image_url, // FIXED: Changed from productImageUrl
            updated_at: new Date().toISOString(),
        },
        {
            onConflict: "user_id,url",//Unique constraint on user_id and url
            ignoreDuplicates: false,//important to update existing record
        }
    ).select().single();


        if (error) throw error;

        //add to price history if new product or price has changed
        if (!isUpdate || existingProduct.current_price !== newPrice) {
            const {error: historyError} = await supabase.from("price_history").insert({
                product_id: product.id,
                price: newPrice,
                currency: currency,
                checked_at: new Date().toISOString(),
            });
            if (historyError) throw historyError;
        }

        revalidatePath("/");
        return {
             success: true,
             product,
             isUpdate, // ADDED: Your form expects this
             message : isUpdate ? "Product updated successfully" : "Product added successfully",
        };


    } catch (error) {
        console.error("Error adding product:", error);
        return { error: error.message || "An error occurred while adding the product" };

    }
}

//Delete product action
export async function deleteProduct(productId) {
    try {
        const supabase = await createClient();
        const {error} = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

        if (error) throw error;

        revalidatePath("/");
        return { success: true, message: "Product deleted successfully" };
            
        }
        catch (error) {
            return { error: error.message || "An error occurred while deleting the product" };
    }}

    //Get products action
    export async function getProducts(){
        try{
            const supabase = await createClient();
            const {data: products, error} = await supabase
            .from("products")
            .select("*")
            .order("created_at", {ascending: false});

        if (error) throw error;
        return products || [];

        } catch (error) {
            console.error("Get products error:", error);
            return[];
        }
    }

    // get price history action
    export async function getPriceHistory(productId){
        try{
            const supabase = await createClient();
            const {data, error} = await supabase
            .from("price_history")
            .select("*")
            .eq("product_id", productId)
            .order("checked_at", {ascending: true});

        if (error) throw error;
        return data || [];

        } catch (error) {
            console.error("Get price history error:", error);
            return[];
        }
    }

