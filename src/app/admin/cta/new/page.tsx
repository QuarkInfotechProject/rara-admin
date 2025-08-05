import CTAEditor from "@/components/cta/cta-editor";
import PageTitle from "@/components/page-title";

function NewCTA() {
  return (
    <div>
      <PageTitle title="New CTA" prevPage="./" />
      <CTAEditor />
    </div>
  );
}

export default NewCTA;
