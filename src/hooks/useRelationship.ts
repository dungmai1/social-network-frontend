import { addFollow } from "@/services/relationship.service";
import { useState } from "react";

export default function useRelationship(username: string) {
    // const [stateFollow,setStateFollow] = useState<boolean>(false);
    const handleAddFollow = async () => {
        try {
            const res = await addFollow(username);
            // setStateFollow(!stateFollow)
            if (!res.ok) return;
        } catch {
            console.log("Error add follow");
        }
    }
    return { handleAddFollow }
}
