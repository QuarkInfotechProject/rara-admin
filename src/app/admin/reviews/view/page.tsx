import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import ReviewEditor from "@/components/reviews/review-editor";
import getReviewDetails from "@/lib/utils/server/get-review-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function ViewReview({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getReviewDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Review" prevPage="./" />
      <ReviewEditor initialData={data} />
    </div>
  );
}

export default ViewReview;
