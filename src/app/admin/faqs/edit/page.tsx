import { notFound } from "next/navigation";
import FAQEditor from "@/components/faqs/faq-editor";
import PageTitle from "@/components/page-title";
import getFAQDetails from "@/lib/utils/server/get-faq-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditFAQ({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getFAQDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit FAQ" prevPage="./" />
      <FAQEditor edit initialData={data} />
    </div>
  );
}

export default EditFAQ;
export const dynamic = "force-dynamic";
