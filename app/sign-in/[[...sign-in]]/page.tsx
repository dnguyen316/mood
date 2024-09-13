import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="justify-center items-center flex w-full h-screen">
      <SignIn />
    </div>
  );
};

export default SignInPage;
