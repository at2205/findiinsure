import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";
import { fetchInsurePlans } from "@/services/apiService";

export default async function ProductsPage() {
  const apiResponse = await fetchInsurePlans();

  const products: {
    id: string;
    name: string;
    slug: string;
    premium: number;
    displayAmount?: string;
    image: string;
    shortDescription: string;
    activeFlag: string;
  }[] =
    apiResponse?.data?.map((item: any) => ({
      id: item.id,
      name: item.planName,
      slug: item.planName.toLowerCase().replace(/\s+/g, "-"),
      premium: Number(item.amount),
      displayAmount :item.displayAmount,
      image: item.imagePath,
      shortDescription: item.planDescription,
      activeFlag: item.activeFlag ?? "1",
    })) || [];

  // Show active (1) and coming soon (-1), hide disabled (0)
  const visibleProducts = products.filter((p) => p.activeFlag === "1" || p.activeFlag === "-1");

  return (
    <>
      <PageHero
        title="Our Products"
        subtitle="Browse our insurance plans"
      />

      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <ProductGrid products={visibleProducts} />
        </div>
      </section>
    </>
  );
}