import { Add, Circle, CircleOutlined, DeleteForever, Edit, ExpandLess, ExpandMore, Group as GroupIcon, Menu } from "@mui/icons-material";
import { AppBar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, FormLabel, IconButton, Switch, TextField, Toolbar, Typography } from "@mui/material";
import React, { FormEvent, useCallback, useMemo } from "react";
import { Device, useDevices } from "../model/useDevices";
import { Group, useGroups } from "../model/useGroups";
import { pick } from "../utils";
import { MultiDeviceView } from "./DeviceView";

function GroupEditor({ devices, group }: { devices: Device[], group?: Group }) {
    return <>
        <style jsx global>{`
            .checkboxes {
                column-width: 140px;
                column-gap: 0;
                display: block;
            }
            .checkboxes label {
                display: block;
            }
        `}</style>
        <DialogTitle>{group ? "Gruppe bearbeiten" : "Gruppe erstellen"}</DialogTitle>
        <DialogContent>
            <TextField fullWidth variant="standard" label="Gruppenname" defaultValue={group?.name ?? "Neue Gruppe"} name="name" sx={{ my: 2 }} />
            <Box sx={{ my: 2 }}>
                <FormLabel component="legend">Gruppenmitglieder</FormLabel>
                <FormGroup className="checkboxes">
                    {devices.map(d => <FormControlLabel key={d.id} control={
                        <Checkbox defaultChecked={group?.devices.includes(d.id)} name="devices" value={d.id} />
                    } label={d.name} />)}
                </FormGroup>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button type="reset">Abbrechen</Button>
            <Button type="submit" variant="outlined">Speichern</Button>
        </DialogActions>
    </>
}


function GroupView({ devices, group }: { devices: Device[], group: Group }) {
    const { save, drop } = useGroups(x => pick(x, 'save', 'drop'))
    const execute = useDevices(x => x.execute)
    const [open, setOpen] = React.useState(false)
    const [editing, setEditing] = React.useState(false)
    const [deleting, setDeleting] = React.useState(false)

    const devs = useMemo(
        () => group.devices.map(id => devices.find(d => d.id === id)!),
        [devices, group])

    const anyOn = devs.some(x => x.traits.some(t => t.name === "OnOff" && t.state === "on"))
    const toggleAll = useCallback(() => {
        const newState = anyOn ? "off" : "on";
        for (const dev of devs)
            for (const trait of dev.traits)
                if (trait.name === "OnOff")
                    execute(dev.id, trait.name, newState)
    }, [devs, anyOn])

    const editGroup = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const name = data.get("name") as string
        const devices = Array.from(data.getAll("devices")).map(x => +x)
        if (await save({ id: group.id, name, devices })) setEditing(false)
    }, [group.id])

    return <div className="group">
        <style jsx global>{`
            .group {
                background-color: white;
            }
            .group-header {
                background-color: #f5f5f5;
                shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
                padding: 0.5em 1em;
                font-size: 1.2em;
            }
            .group-header .row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        `}</style>

        <div className="group-header" onClick={() => setOpen(x => !x)}>
            <Box className="row">
                <GroupIcon />
                <div className="group-name">{group.name}</div>
                <IconButton color="primary" onClick={(e) => (e.stopPropagation(), setEditing(true))}>
                    <Edit />
                </IconButton>
            </Box>

            <Box className="row" sx={{ py: 1, fontSize: "1.2em" }}>
                {open ? <ExpandLess /> : <ExpandMore />}

                <FormControlLabel onClick={e => e.stopPropagation()} control={
                    <Switch checked={anyOn} onChange={toggleAll} />
                } label="Alle umschalten" />

                <IconButton color="warning" onClick={() => setDeleting(true)}>
                    <DeleteForever />
                </IconButton>
            </Box>
        </div>

        {open && <div className="group-body">
            <MultiDeviceView devices={devs} />
        </div>}

        <Dialog open={editing} onClose={() => setEditing(false)} fullWidth={true}>
            <form onSubmit={editGroup} onReset={() => setEditing(false)}>
                <GroupEditor devices={devices} group={group} />
            </form>
        </Dialog>

        <Dialog open={deleting} onClose={() => setDeleting(false)}>
            <DialogTitle>Gruppe löschen</DialogTitle>
            <DialogContent>
                <Typography>Möchtest du die Gruppe "{group.name}" wirklich löschen?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleting(false)}>Abbrechen</Button>
                <Button color="warning" onClick={() => drop(group.id)}>Löschen</Button>
            </DialogActions>
        </Dialog>
    </div>
}

export function GroupsScreen() {
    const { groups, save } = useGroups()
    const { devices } = useDevices()
    const [creating, setCreating] = React.useState(false)

    const create = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const name = data.get("name") as string
        const devices = Array.from(data.getAll("devices")).map(x => +x)
        if (await save({ name, devices })) setCreating(false)
    }, [])

    return <>
        <AppBar position="static" color="primary">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>
                <Typography variant="h6">Gruppen</Typography>
            </Toolbar>
        </AppBar>
        <div className="content">
            <div id="groups">
                {groups?.map(group => <GroupView key={group.id} devices={devices} group={group} />)}

                <Box sx={{ my: 2 }}>
                    <IconButton onClick={() => setCreating(true)}>
                        <Add />
                    </IconButton>
                </Box>
            </div>
        </div>

        <Dialog open={creating} onClose={() => setCreating(false)} fullWidth={true}>
            <form onSubmit={create} onReset={() => setCreating(false)}>
                <GroupEditor devices={devices} />
            </form>
        </Dialog>
    </>
}