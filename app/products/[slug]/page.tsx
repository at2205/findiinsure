"use client";

import { notFound } from "next/navigation";
import { fetchInsurePlans } from "@/services/apiService";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import productsData from "@/data/products.json";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = productsData.products.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  const [dynamicPrice, setDynamicPrice] = useState<string | null>(null);
  const [dynamicDescription, setDynamicDescription] = useState<string | null>(null);
  const [activeFlag, setActiveFlag] = useState<string>("1");

  useEffect(() => {
    const fetchData = async () => {
      const apiResponse = await fetchInsurePlans();

      const apiProduct = apiResponse?.data?.find(
        (item: any) =>
          item.planName.toLowerCase().replace(/\s+/g, "-") === slug
      );

      if (apiProduct) {
        if (apiProduct.displayAmount) {
          setDynamicPrice(apiProduct.displayAmount);
        }

        if (apiProduct.planDescription) {
          setDynamicDescription(apiProduct.planDescription);
        }

        if (apiProduct.activeFlag !== undefined) {
          setActiveFlag(apiProduct.activeFlag);
        }
      }
    };

    fetchData();
  }, [slug]);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#1C3C5F] to-[#142d47] pt-[calc(72px+48px)] pb-12 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-white text-[2.25rem] font-bold mb-3">
            {product.name}
          </h1>
          <p className="text-white/70">
            {product.category} Insurance
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <div className="bg-white border rounded-[18px] overflow-hidden shadow-md">

            {/* Image + Info */}
            <div className="grid grid-cols-2 max-lg:grid-cols-1">
              
              {/* Image */}
              <div className="bg-[#F1F3F6] flex items-center justify-center p-8">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={280}
                  className="object-contain"
                />
              </div>

              {/* Info */}
              <div className="p-10 flex flex-col justify-center">
                
                {/* Title */}
                <h2 className="text-[1.75rem] font-extrabold mb-2">
                  {product.name}
                </h2>

                {/* 🔥 Dynamic Short Description */}
                <p className="text-[#8A94A6] text-[0.95rem] mb-4">
                  {dynamicDescription || product.shortDescription}
                </p>

                {/* Premium Box */}
                {activeFlag !== "-1" && (
                <div className="border rounded-[14px] p-5 mb-6">
                  <div className="text-[0.8rem] text-gray-500 mb-1">
                    Starting Premium
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-[2rem] font-bold text-[#1C3C5F]">
                      {dynamicPrice || `₹${product.premium}`}
                    </span>
                    <span className="text-[0.9rem] text-gray-500">
                      / {product.tenure}
                    </span>
                  </div>
                </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  {activeFlag === "-1" ? (
                    <span className="bg-[#E0E4EA] text-[#8A94A6] px-6 py-3 rounded-full font-semibold cursor-not-allowed select-none">
                      Coming Soon
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        addToCart(
                          {
                            id: product.id,
                            name: product.name,
                            premium: product.premium,
                            slug: product.slug,
                          },
                          true
                        )
                      }
                      className="bg-[#D43F33] text-white px-6 py-3 rounded-full hover:bg-[#b8352b] transition"
                    >
                      Buy Now
                    </button>
                  )}

                  <Link
                    href="/products"
                    className="border px-6 py-3 rounded-full hover:bg-[#1C3C5F] hover:text-white transition"
                  >
                    All Products
                  </Link>
                </div>
              </div>
            </div>

            {/* Full Description (Still JSON) */}
            <div className="p-10 border-t">
              <h3 className="font-bold mb-4">About This Plan</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}