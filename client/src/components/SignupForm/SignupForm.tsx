import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "@/features/api/auth-api";
import { Button } from "../ui/button";
import { toastNotifyError } from "@/lib/utils";

export default function SignUp() {
  const [signUp, { data, isLoading, isError, isSuccess, isUninitialized }] = useSignupMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const signUpErrorMessage = "There was an issue creating your account.";

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("in handleSignUp function", email, password);

    if (password !== confirmPassword) toastNotifyError("Passwords do not match.")

    try {
      await signUp({
        email: email.toLowerCase(),
        password: password,
        confirmPassword: confirmPassword,
      }).unwrap();
      console.log("success", data);
    } catch (error) {
      console.log("failure", error);
    }
  };

  useEffect(() => {
    console.log("in useEffect", {isError, isSuccess, isUninitialized});
    if (isUninitialized || isLoading) return;
    if (isSuccess) {
      navigate("/auth/dashboard");
    } else if (isError) {
      toastNotifyError(signUpErrorMessage);
    }
  }, [isError, isSuccess, isLoading, isUninitialized, navigate]);

  return (
    <div className="my-[150px] bg-white w-[450px] h-fit drop-shadow-lg p-10 rounded-lg">
      <h1 className="font-bold text-4xl">Welcome!</h1>
      <div className="h-2"></div>
      <h2 className="font-normal text-2xl">Sign up to continue</h2>
      <div className="h-16"></div>
      <form onSubmit={handleSignUp} className="flex flex-col">
        <label className="mb-1" htmlFor="email">
          Email
        </label>
        <div className="absolute translate-y-8 translate-x-2 pointer-events-none">
          <PersonIcon className="text-gray-400" />
        </div>
        <input
          id="email"
          name="email"
          className="w-full border-2 border-violetBrand rounded-md mb-6 h-9 px-3 pl-9 focus:outline-none focus:border-black"
          type="email"
          placeholder="kanular@example.com"
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading ? true : false}
          required
        />

        <label className="mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          className="w-full border-2 border-violetBrand rounded-md mb-6 h-9 px-3 focus:outline-none focus:border-black"
          type="password"
          placeholder="password"
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          disabled={isLoading ? true : false}
          required
        />

        <label className="mb-1" htmlFor="confirmedPassword">
          Confirm Password
        </label>
        <input
          id="confirmedPassword"
          name="confirmedPassword"
          className="w-full border-2 border-violetBrand rounded-md h-9 px-3 focus:outline-none focus:border-black"
          type="password"
          placeholder="password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
          disabled={isLoading ? true : false}
          required
        />
        <div className="h-8"></div>

        <Button type="submit" disabled={isLoading ? true : false}>
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          Sign Up
        </Button>
        <div className="h-3"></div>
        <div className="flex items-center">
          <label
            htmlFor="terms1"
            className="opacity-55 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            By signing up, you agree to the{" "}
            <a href="/termsofservice" className="underline">
              Terms and Conditions
            </a>
          </label>
        </div>
        <div className="h-4"></div>
        <div className="flex justify-end">
          <span className="opacity-55 text-sm">
            Already have an account?&nbsp;
          </span>
          <Link className="text-blue-600 text-sm" to={"/auth/login"}>
            Log in
          </Link>
        </div>
      </form>
      <div className="h-2"></div>
    </div>
  );
}