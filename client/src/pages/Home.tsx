import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col pl-3">
      Home
      <Link to={"/auth/login"}>
        <Button variant={"default"}>login</Button>
      </Link>
      <div className="h-2"></div>
      <Link to={"/auth/dashboard"}>
        <Button variant={"default"}>dashboard</Button>
      </Link>
    </div>
  );
}
