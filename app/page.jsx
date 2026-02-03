import { Bell, Rabbit, Shield, TrendingDown } from "lucide-react";
import Image from "next/image";
import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "./action";
import ProductCard from "@/components/ProductCard";


export default async function Home() {

  const supabase = await createClient();

  const {
     data: { user },
     } = await supabase.auth.getUser();

  const products = user ? await getProducts() : [];

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50 ">
    {/*header*/}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

           <Image src={"/deal-drop-logo.png"} 
            alt="Deal Drop Logo"
             width={600}
             height={200} 
            className="h-10 w-auto "/>
          </div>

          {/* auth Button */}
          <AuthButton  user={user}/>
        </div>
      </header>
      {/* Hero Section */}
      <section className="py-10 px-10">
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-2 rounded-full text-sm font-medium mb-6">
            Made with ❤ by DealDrop! 
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Never Miss a Deal Again
          </h2>

          <p className="text-gray-700 mb-12 text-lg max-w-2xl mx-auto">
            Discover the best deals across your favorite e-commerce sites with DealDrop. Get real-time price alerts and save more on every purchase.
          </p>

          {/* Add Products From Here */}
          <AddProductForm user={user} />
          </div>

          {/* Features Section */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16 px-4 py-5 mt-10 text-center justify-center">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className=" font-semibold text-gray-900 mb-2 ">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
                </div>
            ))}

        </div>)}
        
      </section>



      {user && products.length > 0 &&  (
        <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
             Your Tracked Products </h3>

          <span className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? "product" : "products"}


          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>)}

      {/* Products Section */}
      {user && products.length ===0 && (
        <section className="max-w-2xl mx-auto text-center py-10 px-4">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-2"/>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              You haven't added any products yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start tracking prices by adding product URLs above.
            </p>
          

            
          </div>
        </section>
      )
        }


    </main>
  );
}