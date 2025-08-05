import FAQEditor from "@/components/faqs/faq-editor";
import PageTitle from "@/components/page-title";

function NewFAQ() {
  return (
    <div>
      <PageTitle title="New FAQ" prevPage="./" />
      <FAQEditor />
    </div>
  );
}

export default NewFAQ;
