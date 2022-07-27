
import React from "react";
import { useDevices } from "../model/useDevices";
import { AppToolbar } from "./AppToolbar";
import { MultiDeviceView } from "./DeviceView";


export function DevicesScreen() {
    const { devices } = useDevices()

    return <>
        <AppToolbar title="Geräte" />
        <div className="content">
            {devices && <MultiDeviceView devices={devices} />}
        </div>
    </>
}