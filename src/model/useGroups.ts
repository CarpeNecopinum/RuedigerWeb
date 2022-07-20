import { useCallback } from "react";
import { createStore } from "reusable";
import useSWR from "swr";
import { fetch_json, post_json } from "../utils";

export type Group = {
    id: number;
    name: string;
    devices: number[];
}

export const useGroups = createStore(() => {
    const {data: groups, mutate} = useSWR<Group[]>("/groups/list",
        process.env["NODE_ENV"] === "development" ?
        () => require('./test_groups.json') : fetch_json)
    
    const save = useCallback(async (group: Group | Omit<Group, 'id'>) => {
        const res = await post_json("/groups/save", group)
        if (res.ok) { 
            mutate()
            return true
        }
        return false
    }, [])

    const drop = useCallback(async (group_id: number) => {
        const res = await post_json("/groups/drop", {id: group_id})
        if (res.ok) {
            mutate()
            return true
        }
        return false
    }, [])

    return {
        groups,
        save,
        drop
    }    
})