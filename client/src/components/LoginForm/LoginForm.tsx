import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/features/api/auth-api";
import { useState } from "react";
import { toastNotifyError } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setUserSession } from "@/features/slice/userSession/userSessionSlice";

export default function LogIn() {
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginErrorMessage = "Incorrect email and/or password.";

  const handleLogin = async (event: React.FormEvent) => {
    console.log("in handleLogin function", email, password);
    event.preventDefault();
    try {
      const userAccountDto = await login({ email: email, password: password }).unwrap();
      console.log("success", userAccountDto);
      dispatch(setUserSession(userAccountDto))
      navigate("/auth/dashboard");
    } catch (error) {
      console.log("failure", error);
      toastNotifyError(loginErrorMessage);
    }
  };

  return (
    <>
      <div className="my-[150px] bg-white w-[450px] h-fit drop-shadow-lg p-10 rounded-lg">
        <h1 className="font-bold text-4xl">Welcome!</h1>
        <div className="h-2"></div>
        <h2 className="font-normal text-2xl">Log in to continue</h2>
        <div className="h-16"></div>
        <form onSubmit={handleLogin} className="flex flex-col">
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
            required
          />
          <label className="mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            className="w-full border-2 border-violetBrand rounded-md mb-2 h-9 px-3 focus:outline-none focus:border-black"
            type="password"
            placeholder="password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <div className="h-7"></div>
          <Button type="submit" disabled={isLoading ? true : false}>
            {isLoading ? <Loader2 className="animate-spin" /> : null}
            Log In
          </Button>
        </form>
        <div className="h-2"></div>
        <div className="w-full flex justify-between">
          <div>
            <span className="opacity-55 text-sm">
              Don&apos;t have an account?&nbsp;
            </span>
            <Link className="text-blue-600 text-sm" to={"/signup"}>
              Sign Up
            </Link>
          </div>
          <div>
            <Link to={"/resetpassword"}>
              <span className="text-blue-600 text-sm cursor-pointer">
                Forgot password?
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
