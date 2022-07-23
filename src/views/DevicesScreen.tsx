import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useDevices } from "../model/useDevices";
import { MultiDeviceView } from "./DeviceView";


export function DevicesScreen() {
    const { devices } = useDevices()

    return <>
        <AppBar position="static" color="primary">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>
                <Typography variant="h6">Geräte</Typography>
            </Toolbar>
        </AppBar>
        <div className="content">
            {devices && <MultiDeviceView devices={devices} />}
        </div>
    </>
}