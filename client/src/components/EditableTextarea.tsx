import { useState } from "react";
import { Button } from "./ui/button";
import { useUpdateCardBodyMutation } from "@/features/api/board-api";
import { LoaderCircle } from "lucide-react";

export default function EditableTextarea({
  cardId,
  body,
}: {
  cardId: string;
  body: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [bodyValue, setBodyValue] = useState<string>(body);
  const [updateCardBody, { isLoading, isSuccess }] = useUpdateCardBodyMutation();

  const handleSave = () => {
    console.log("in handleSave")
    if (bodyValue === body) {
      console.log("please update before saving");
      return;
    }
    try {
      updateCardBody({
        cardId,
        bodyValue,
      }).unwrap();
      setIsFocused(false);
    } catch {
      return
    }
  };

  return (
    <div className="flex flex-col h-fit">
      <textarea
        name="text"
        defaultValue={body}
        onChange={(event) => {
          setBodyValue(event.target.value);
        }}
        className="resize-none w-full field-sizing-content m-0"
        onClick={() => setIsFocused(true)}
        disabled={isLoading}
      />
      <div className="flex justify-start mt-1 gap-2">
        {isFocused && (
          <div className="flex mt-1 w-full gap-2 pt-1">
            <Button className="flex h-6 text-xs font-normal w-2/7" variant={"outline"} onClick={() => setIsFocused(false)}>Cancel</Button>
            <Button
              className="flex flex-auto h-6 text-xs font-normal"
              variant="default"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading && <LoaderCircle className="animate-spin" />}
              {isSuccess ? "Saved" : "Save"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
