import { TextField } from "@mui/material";
import React from "react";
import { Device } from "../model/useDevices";

export const ActorForms = {
    Sender433: ({ device }: { device?: Partial<Device> }) => {
        const [actorData, setActorData] = React.useState(JSON.parse(device?.actor_data ?? "null") || {});
        const setPart = (key: string, value: any) => {
            const new_actor_data = { ...actorData, [key]: value }
            if (!value) delete new_actor_data[key]
            setActorData(new_actor_data)
        }

        const reuse_trait = device?.traits?.length === 1 && device?.traits[0].name === "OnOff"

        return <>
            <TextField label="Einschalt-Code" name="code_on"
                fullWidth sx={{ my: 2 }} required
                value={actorData?.code_on}
                onChange={e => setPart('code_on', e.target.value)} />
            <TextField label="Ausschalt-Code" name="code_off"
                fullWidth sx={{ my: 2 }} required
                value={actorData?.code_off}
                onChange={e => setPart('code_off', e.target.value)} />
            <TextField label="Protokoll" name="protocol"
                fullWidth sx={{ my: 2 }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                value={actorData?.protocol}
                onChange={e => setPart('protocol', e.target.value)} />
            <TextField label="Pulslänge" name="pulselength"
                fullWidth sx={{ my: 2 }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                value={actorData?.pulselength}
                onChange={e => setPart('pulselength', e.target.value)} />
            <input type="hidden" name="actor_data" value={JSON.stringify(actorData)} />
            <input type="hidden" name="traits" value={
                reuse_trait ? JSON.stringify(device?.traits) : JSON.stringify([
                    { name: "OnOff", state: "off" },
                ])}
            />
        </>
    },

    Computer: ({ device }: { device?: Partial<Device> }) => {
        const [actorData, setActorData] = React.useState(JSON.parse(device?.actor_data ?? "null") || {});
        const setPart = (key: string, value: any) => {
            const new_actor_data = { ...actorData, [key]: value }
            if (!value) delete new_actor_data[key]
            setActorData(new_actor_data)
        }

        const reuse_trait = device?.traits?.length === 1 && device?.traits[0].name === "On"

        return <>
            <TextField label="Host" name="host"
                fullWidth sx={{ my: 2 }} required
                value={actorData?.host}
                onChange={e => setPart('host', e.target.value)} />
            <TextField label="Mac-Adresse" name="mac"
                fullWidth sx={{ my: 2 }} required
                value={actorData?.mac}
                onChange={e => setPart('mac', e.target.value)} />

            <input type="hidden" name="actor_data" value={JSON.stringify(actorData)} />
            <input type="hidden" name="traits" value={
                reuse_trait ? JSON.stringify(device?.traits) : JSON.stringify([
                    { name: "On", state: "" },
                ])}
            />
        </>
    }
}