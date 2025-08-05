import PageTitle from "@/components/page-title";
import AmenityEditor from "@/components/product/amenity/amenity-editor";

function NewAmenity() {
  return (
    <div>
      <PageTitle title="New Amenity" prevPage="./" />
      <AmenityEditor />
    </div>
  );
}

export default NewAmenity;
