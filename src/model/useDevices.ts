import { useCallback } from "react";
import { createStore } from "reusable";
import useSWR from "swr";
import { fetch_json, post_json } from "../utils";

export type Trait = {
    name: string,
    state: string
}

export type Device = {
    id: number;
    name: string;
    kind: string;
    traits: Trait[]
}

const test_devices = [
    {
      "traits" : [
        {
          "device_id" : 5,
          "state" : "off",
          "name" : "OnOff"
        }
      ],
      "actor" : "Sender433",
      "name" : "Stecker 1A",
      "kind" : "outlet",
      "actor_data" : "{\"code_off\":\"14107552\",\"code_on\":\"14088368\"}",
      "id" : 5
    },
    {
      "traits" : [
        {
          "name" : "OnOff",
          "device_id" : 6,
          "state" : "off"
        }
      ],
      "actor" : "Sender433",
      "name" : "Stecker 1B",
      "kind" : "outlet",
      "actor_data" : "{\"code_on\":\"14088372\",\"code_off\":\"14107556\"}",
      "id" : 6
    },
    {
      "traits" : [
        {
          "name" : "OnOff",
          "device_id" : 7,
          "state" : "off"
        }
      ],
      "actor" : "Sender433",
      "name" : "Stecker 1C",
      "kind" : "outlet",
      "actor_data" : "{\"code_on\":\"14088380\",\"code_off\":\"14107564\"}",
      "id" : 7
    },
    {
      "traits" : [
        {
          "name" : "OnOff",
          "state" : "off",
          "device_id" : 8
        }
      ],
      "actor" : "Sender433",
      "name" : "Stecker 1D",
      "kind" : "outlet",
      "actor_data" : "{\"code_on\":\"14107554\",\"code_off\":\"14088370\"}",
      "id" : 8
    }
  ]

export const useDevices = createStore(() => {
    const {error, data: devices, mutate} = useSWR<Device[]>("/devices/list",
        process.env["NODE_ENV"] === "development" ?
        () => require('./test_devices.json') : fetch_json)

    const execute = useCallback(async (device_id: number, trait: string, command: string) => {
        const res = await post_json("/devices/execute", {
            device_id,
            trait_name: trait,
            command
        })
        if (res.ok) mutate()
    }, [mutate])

    return {
        devices: devices ?? [],
        execute
    }
})