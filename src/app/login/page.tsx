import Image from "next/image";
import ImgMountain from "@/images/backgrounds/mountains.jpeg";
import LoginForm from "@/components/auth/login-form";

function Login() {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:min-h-screen">
      <div className="flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={ImgMountain}
          alt="Mountain"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.6] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default Login;
