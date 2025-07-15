"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  hero_image: string;
  description?: string;
}

export default function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch only 4 featured products for homepage
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(4)
          .order("id", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
        } else {
          setFeaturedProducts(data || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="bg-black text-white">
      {/* HERO SECTION WITH REAL VIDEO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80">
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
            <source
              src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
              type="video/mp4"
            />
          </video>
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl text-sm font-bold text-white border border-red-400/30 shadow-lg shadow-red-500/20">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              LIVE • Now Available
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              iPhone
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Revolution
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 mb-12 font-light max-w-4xl mx-auto leading-relaxed">
            Experience the future in your hands. Premium iPhones with
            cutting-edge technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/products"
              className="group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-3">
              Shop Collection
              <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            <button className="border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 hover:border-white/60 transition-all duration-500 backdrop-blur-sm">
              Watch Demo
            </button>
          </div>

          {/* Floating iPhone */}
          <div className="relative">
            <div className="w-96 h-96 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl animate-pulse"></div>
              <img
                src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692845702501"
                alt="iPhone 15 Pro Max"
                className="relative z-10 w-full h-full object-contain transform hover:scale-110 transition-transform duration-1000 filter drop-shadow-2xl"
              />

              {/* Floating particles */}
              <div className="absolute top-20 left-20 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-80"></div>
              <div className="absolute bottom-32 right-16 w-4 h-4 bg-purple-400 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute top-40 right-20 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-90"></div>
              <div className="absolute bottom-20 left-10 w-2 h-2 bg-white rounded-full animate-ping opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Your Products from Database */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Premium Collection
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Handpicked iPhones with the latest technology and stunning
                design
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-1 border border-white/10 hover:border-white/30 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105 hover:-translate-y-2">
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

                  {/* Inner card */}
                  <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl p-6 h-full">
                    {/* Stock badge */}
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          Only {product.stock} left
                        </span>
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          Sold Out
                        </span>
                      </div>
                    )}

                    {/* Product image with floating effect */}
                    <div className="aspect-square mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-700"></div>
                      <img
                        src={product.hero_image}
                        alt={product.title}
                        className="relative z-10 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 filter drop-shadow-2xl"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692845702501";
                        }}
                      />

                      {/* Floating orbs around image */}
                      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300"></div>
                    </div>

                    {/* Product info with glassmorphism */}
                    <div className="space-y-4">
                      {/* Category with glow */}
                      <div className="inline-block">
                        <span className="text-blue-300 text-xs font-bold uppercase tracking-wider bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-400/30">
                          {product.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-blue-100 transition-colors duration-300">
                        {product.title}
                      </h3>

                      {/* Price section with premium styling */}
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                              ${product.price}
                            </span>
                            <div className="text-xs text-gray-400 mt-1">
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </div>
                          </div>

                          {/* Subtle arrow indicator */}
                          <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300">
                            <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                View All Products
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
