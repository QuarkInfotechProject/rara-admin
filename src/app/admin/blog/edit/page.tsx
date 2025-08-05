import { notFound } from "next/navigation";
import PostEditor from "@/components/blog/post-editor";
import PageTitle from "@/components/page-title";
import getBlogDetails from "@/lib/utils/server/get-blog-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditPost({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getBlogDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Post" prevPage="./" />
      <PostEditor initialData={data as any} edit />
    </div>
  );
}

export default EditPost;
export const dynamic = "force-dynamic";
