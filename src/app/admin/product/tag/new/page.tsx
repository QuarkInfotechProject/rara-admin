import PageTitle from "@/components/page-title";
import TagEditor from "@/components/product/tag/tag-editor";

function NewTag() {
  return (
    <div>
      <PageTitle title="New Tag" prevPage="./" />
      <TagEditor />
    </div>
  );
}

export default NewTag;
