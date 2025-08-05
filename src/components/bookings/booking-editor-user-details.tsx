import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditorCard from "../editor-card";

function BookingEditorUserDetails() {
  const form = useFormContext();
  const user = form.watch("user");
  if (!user) return null;

  return (
    <EditorCard title="User">
      <Label>Name</Label>
      <Input readOnly value={user?.name} />
      <Label>Email</Label>
      <Input readOnly value={user?.email} />
    </EditorCard>
  );
}

export default BookingEditorUserDetails;
