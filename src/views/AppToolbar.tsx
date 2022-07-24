import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Switch, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useModes } from "../model/useModes";
import { pick, same } from "../utils";

export function AppToolbar({ title }: { title: string }) {
    const { editing, setEditing } = useModes(x => pick(x, 'editing', 'setEditing'), same);

    return <AppBar position="static" color="primary">
        <Toolbar className="apptoolbar">
            <IconButton edge="start" color="inherit" aria-label="menu">
                <Menu />
            </IconButton>

            <Typography sx={{ flexGrow: 1 }} variant="h6">{title}</Typography>

            <Switch
                color="secondary"
                checked={editing}
                onChange={() => setEditing(!editing)} />
        </Toolbar>
    </AppBar>
}