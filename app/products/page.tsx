import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";
import { fetchInsurePlans } from "@/services/apiService";

export default async function ProductsPage() {
  const apiResponse = await fetchInsurePlans();

  // ✅ Inline type to avoid "implicit any"
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

  // ✅ No TS error here
  const activeProducts = products.filter((p) => p.active);

  return (
    <>
      <PageHero
        title="Our Products"
        subtitle="Browse our insurance plans"
      />

      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <ProductGrid products={activeProducts} />
        </div>
      </section>
    </>
  );
}