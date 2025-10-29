import { getCountFollower, getCountFollowing } from "@/services/relationship.service";
import { useEffect, useState } from "react";

export default function useRelationship(username:string) {
    const [countFollower, setCountFollower] = useState(0);
    const [countFollowing, setCountFollowing] = useState(0);
    const getAllFollower = async () => {
        try{
            const res = await getCountFollowing(username);
            setCountFollowing(res.countFollowing);
        }catch{
            console.log("Error get all follower");
        }
    }
    const getAllFollowing = async () => {
        try{
            const res = await getCountFollower(username);
            setCountFollower(res.countFollower);
        }catch{
            console.log("Error get all follower");
        }
    }
    useEffect(()=>{
        getAllFollower();
        getAllFollowing();
    },[username])
    return {countFollower, countFollowing}
}
