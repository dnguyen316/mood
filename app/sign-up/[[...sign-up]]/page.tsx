import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="justify-center items-center flex w-full h-screen">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
