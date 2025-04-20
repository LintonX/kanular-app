import { useDispatch } from "react-redux";
import BoardView from "./BoardView";
import { useGetHomeBoardQuery } from "@/features/api/board-api";
import { setHomeBoard } from "@/features/slice/userSession/userSessionSlice";
import { useEffect } from "react";

export default function HomeBoardView() {
  console.log("in homeboardview");
  const refetchAfterSeconds = 8;
  const dispatch = useDispatch();
  const {
    data: homeBoard,
    isFetching,
    isLoading,
  } = useGetHomeBoardQuery({
    primaryBoard: true,
    homeBoard: true,
  }, {refetchOnMountOrArgChange: refetchAfterSeconds});

  useEffect(() => {
    if (homeBoard) {
      dispatch(setHomeBoard(homeBoard));
    }
  }, [homeBoard, dispatch]);

  return <>{isFetching || isLoading ? <div>Loading...</div> : <BoardView />}</>;
}
