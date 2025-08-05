import PageTitle from "@/components/page-title";
import PromotionEditor from "@/components/promotions/promotion-editor";

function NewPromotion() {
  return (
    <div>
      <PageTitle title="New Promotion" prevPage="./" />
      <PromotionEditor />
    </div>
  );
}

export default NewPromotion;
