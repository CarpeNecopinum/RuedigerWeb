import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import React from "react";
import { useDevices } from "../model/useDevices";
import { DeviceView } from "./DeviceView";


export function GroupsScreen() {
    const { devices } = useDevices()

    return <>
        <AppBar position="static" color="primary">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>
                <Typography variant="h6">Gruppen</Typography>
            </Toolbar>
        </AppBar>
        <div id="devices">
            {devices.map(device => <DeviceView key={device.id} device={device} />)}
        </div>
    </>
}