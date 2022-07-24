
import { Add } from "@mui/icons-material";
import { Dialog, IconButton } from "@mui/material";
import React from "react";
import { useDevices } from "../model/useDevices";
import { useModes } from "../model/useModes";
import { AppToolbar } from "./AppToolbar";
import { DeviceForm, MultiDeviceView } from "./DeviceView";


export function DevicesScreen() {
    const { devices } = useDevices()
    const editing = useModes(x => x.editing)
    const [creating, setCreating] = React.useState(false)

    return <>
        <AppToolbar title="Geräte" />
        <div className="content">
            {devices && <MultiDeviceView devices={devices} />}
            {editing && <IconButton onClick={() => setCreating(true)}>
                <Add />
            </IconButton>}
        </div>

        <Dialog open={creating} onClose={() => setCreating(false)}>
            <DeviceForm onClose={() => setCreating(false)} />
        </Dialog>
    </>
}