import { notFound } from "next/navigation";
import CategoryEditor from "@/components/blog/category-editor";
import PageTitle from "@/components/page-title";
import getBlogCategory from "@/lib/utils/server/get-blog-category";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditCategory({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getBlogCategory(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Category" prevPage="./" />
      <CategoryEditor edit initialData={data} />
    </div>
  );
}

export default EditCategory;
export const dynamic = "force-dynamic";
