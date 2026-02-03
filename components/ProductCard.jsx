"use client"
import React from 'react'
import { useState } from "react";
import { deleteProduct } from '@/app/action';   
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Trash2, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PriceChart from './PriceChart';




const ProductCard = ({ product }) => {
    const [showChart, setShowChart] =useState(false);
    const [deleting, setDeleting] = useState (false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) 
            return;

        setDeleting(true);
        const result = await deleteProduct(product.id);

         if (result.error){
            toast.error(result.error);
            } else {
                toast.success(result.message || "Product deleted successfully");
                setUrl("");
            }
        setDeleting(false);

        
        };

  return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className={"pb-3"}>
           <div className="flex gap-4">
            {product.image_url && (
                <img
                src={product.image_url}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md border"
                />
            )}

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
                </h3>

                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-orange-500">
                    {product.current_price} {product.currency}
                    </span>

                    <Badge varient="secondary" className="gap-1">
                        <TrendingDown className='w-3 h-3'/>
                        Tracking 
                    </Badge>
                </div>
            </div>

           </div>
            
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              className="gap-1"
              >
                {showChart ?(
                    <>
                    <ChevronUp className="w-4 h-4 mr-2"/>
                    Hide Price Chart
                    </>
                ) : (
                    <>
                    <ChevronDown className="w-4 h-4 mr-2"/>
                    Show Price Chart
                    </>
                )}
              </Button>

              <Button variant="outline" size="sm" asChild className="gap-1 ">
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4"/>
                        View Product
                </a>
              </Button > 

             <Button 
             variant="gosht"
             size="sm"
             onClick={handleDelete}
             diabled={deleting}
             className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700">
             <Trash2 className="w-4 h-4"/>
                Remove

             </Button>
            </div>
        </CardContent>

        {showChart && (
        <CardFooter className="pt-0"> 
           <PriceChart productId={product.id} />

        </CardFooter>
        )}
        </Card>
      
  );
};

export default ProductCard;
