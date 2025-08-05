import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import AmenityEditor from "@/components/product/amenity/amenity-editor";
import getAmenityDetails from "@/lib/utils/server/get-amenity-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function NewAmenity({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getAmenityDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Amenity" prevPage="./" />
      <AmenityEditor edit initialData={data} />
    </div>
  );
}

export default NewAmenity;
export const dynamic = "force-dynamic";
