import Link from "next/link";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import FeaturesGrid from "@/components/FeaturesGrid";
import { fetchInsurePlans } from "@/services/apiService";
import SetAgentSession from "@/components/SetAgentSession";

export default async function HomePage() {
  const apiResponse = await fetchInsurePlans();

  const agentId = apiResponse?.agentId || null;

  // ✅ Inline type (fixes TS error cleanly)
  const products: {
    id: string;
    name: string;
    slug: string;
    premium: number;
    displayAmount?: string;
    image: string;
    shortDescription: string;
    active: boolean;
  }[] =
    apiResponse?.data?.map((item: any) => ({
      id: item.id,
      name: item.planName,
      slug: item.planName.toLowerCase().replace(/\s+/g, "-"),
      premium: Number(item.amount),
      displayAmount :item.displayAmount,
      image: item.imagePath,
      shortDescription: item.planDescription,
      active: item.isActive === "1",
    })) || [];

  // ✅ No more "implicit any" error
  const highlights = products.filter((p) => p.active).slice(0, 3);

  return (
    <>
      {/* ✅ Store agentId in session */}
      <SetAgentSession agentId={agentId} />

      <Hero />

      <section className="py-20 max-md:py-14">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-5">
          <div className="text-center mb-12">
            <h2 className="text-[2rem] font-bold mb-3">
              Popular Insurance Plans
            </h2>
            <p className="text-[#8A94A6]">
              Top rated insurance solutions for you and your family.
            </p>
          </div>

          <ProductGrid products={highlights} />

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1C3C5F] text-white hover:bg-[#264d78] transition"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </section>

      <FeaturesGrid />
    </>
  );
}