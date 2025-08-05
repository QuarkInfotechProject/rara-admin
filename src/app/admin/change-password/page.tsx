import ChangePasswordForm from "@/components/auth/change-password-form";
import PageLayout from "@/components/page-layout";

function ChangePassword() {
  return (
    <PageLayout
      title="Change Password"
      description="Password must contain 1 capital alphabet, 1 small alphabet, 1 number,
          1 special character, and be at least 8 characters long"
      hidePagination
    >
      <ChangePasswordForm />
    </PageLayout>
  );
}

export default ChangePassword;
