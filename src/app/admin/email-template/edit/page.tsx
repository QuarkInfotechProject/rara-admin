import { notFound } from "next/navigation";
import EmailEditor from "@/components/emails/email-editor";
import PageTitle from "@/components/page-title";
import getEmailDetails from "@/lib/utils/server/get-email-details";

interface Props {
  searchParams: Promise<{ name: string }>;
}

async function EditEmail({ searchParams }: Props) {
  const { name } = await searchParams;
  const data = await getEmailDetails(name);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Email" prevPage="./" />
      <EmailEditor initialData={data} />
    </div>
  );
}

export default EditEmail;
