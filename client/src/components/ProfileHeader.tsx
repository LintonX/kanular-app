import { Circle } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setLogOut } from "@/features/slice/userSession/userSessionSlice";

export default function ProfileHeader() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setLogOut())
  }

  return (
    <div className="flex h-14 w-screen bg-secondary-black px-8 justify-end items-center gap-2">
      <Button onClick={handleLogout} variant={"destructive"}>
        log out
      </Button>
      <Circle></Circle>
    </div>
  );
}
