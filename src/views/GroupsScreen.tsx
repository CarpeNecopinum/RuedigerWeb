import { Add, DeleteForever, Edit, ExpandLess, ExpandMore, Group as GroupIcon } from "@mui/icons-material";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, FormLabel, IconButton, Switch, TextField, Typography } from "@mui/material";
import React, { FormEvent, useCallback, useMemo } from "react";
import { Device, useDevices } from "../model/useDevices";
import { Group, useGroups } from "../model/useGroups";
import { useModes } from "../model/useModes";
import { pick } from "../utils";
import { AppToolbar } from "./AppToolbar";
import { MultiDeviceView } from "./DeviceView";

function GroupEditor({ devices, group }: { devices: Device[], group?: Group }) {
    const [deleting, setDeleting] = React.useState(false)
    const drop = useGroups(x => x.drop)
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
            {group && <Button type="button" color="warning" onClick={() => setDeleting(true)}>Löschen</Button>}
            <Button type="reset">Abbrechen</Button>
            <Button type="submit" variant="outlined">Speichern</Button>
        </DialogActions>


        {group && <Dialog open={deleting} onClose={() => setDeleting(false)}>
            <DialogTitle>Gruppe löschen</DialogTitle>
            <DialogContent>
                <Typography>Möchtest du die Gruppe "{group.name}" wirklich löschen?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleting(false)}>Abbrechen</Button>
                <Button color="warning" onClick={() => drop(group.id)}>Löschen</Button>
            </DialogActions>
        </Dialog>}
    </>
}


function GroupView({ devices, group }: { devices: Device[], group: Group }) {
    const { save } = useGroups(x => pick(x, 'save', 'drop'))
    const execute = useDevices(x => x.execute)
    const [open, setOpen] = React.useState(false)
    const [editingThis, setEditingThis] = React.useState(false)
    const globalEditing = useModes(x => x.editing)

    const devs = useMemo(
        () => group.devices
            .map(id => devices.find(d => d.id === id)!)
            .filter(d => d != null),
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
        if (await save({ id: group.id, name, devices })) setEditingThis(false)
    }, [group.id])

    return <div className="group">
        <style jsx global>{`
            .group {
                position: relative;
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
                {open ? <ExpandLess /> : <ExpandMore />}
                <div className="group-name">{group.name}</div>

                <FormControlLabel onClick={e => e.stopPropagation()} control={
                    <Switch checked={anyOn} onChange={toggleAll} />
                } label="Alle" />
            </Box>
            {/* 
            <Box className="row" sx={{ py: 1, fontSize: "1.2em" }}>
            </Box> */}
        </div>

        {open && <div className="group-body">
            <MultiDeviceView devices={devs} disableEditing />
        </div>}

        {globalEditing && <div className="veil" onClick={() => setEditingThis(true)} />}

        <Dialog open={editingThis} onClose={() => setEditingThis(false)} fullWidth={true}>
            <form onSubmit={editGroup} onReset={() => setEditingThis(false)}>
                <GroupEditor devices={devices} group={group} />
            </form>
        </Dialog>

    </div>
}

export function GroupsScreen() {
    const { groups, save } = useGroups()
    const { devices } = useDevices()
    const [creating, setCreating] = React.useState(false)
    const editing = useModes(x => x.editing)

    const create = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const name = data.get("name") as string
        const devices = Array.from(data.getAll("devices")).map(x => +x)
        if (await save({ name, devices })) setCreating(false)
    }, [])

    return <>
        <AppToolbar title="Gruppen" />
        <div className="content">
            <div id="groups">
                {devices && groups?.map(group => <GroupView key={group.id} devices={devices} group={group} />)}

                {editing && <Box sx={{ my: 2 }}>
                    <IconButton onClick={() => setCreating(true)}>
                        <Add />
                    </IconButton>
                </Box>}
            </div>
        </div>

        <Dialog open={creating} onClose={() => setCreating(false)} fullWidth={true}>
            <form onSubmit={create} onReset={() => setCreating(false)}>
                <GroupEditor devices={devices} />
            </form>
        </Dialog>
    </>
}