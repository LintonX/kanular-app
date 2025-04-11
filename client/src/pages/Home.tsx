import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col">
        Home
        <Link to={"/auth/login"}><Button variant={"default"}>login</Button></Link>
        <Link to={"/auth/dashboard"}><Button variant={"default"}>dashboard</Button></Link>
      </div>
  )
}
