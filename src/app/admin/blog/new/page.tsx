import PostEditor from "@/components/blog/post-editor";
import PageTitle from "@/components/page-title";

function NewPost() {
  return (
    <div>
      <PageTitle title="New Post" prevPage="./" />
      <PostEditor />
    </div>
  );
}

export default NewPost;
