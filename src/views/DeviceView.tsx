import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import React, { FormEvent, useCallback } from "react";
import { Device, device_kinds, useDevices } from "../model/useDevices";
import { useModes } from '../model/useModes';
import { pick } from "../utils";
import { ActorForms } from './ActorForms';
import { Text } from './pieces';

function OnOffView({ device }: { device: Device }) {
    const { execute } = useDevices(x => pick(x, 'execute'));

    const trait = device.traits.find(x => x.name === 'OnOff');
    if (!trait) return null

    const is_on = trait.state === 'on';
    const toggle = () => execute(device.id, trait.name, is_on ? "off" : "on");

    return <div className="onOffView">
        <style>{`
            .onOffView {
                display: flex;
                align-items: center;
                justify-content: space-evenly;
            }
        `}</style>

        <Text>{is_on ? "An" : "Aus"}</Text>
        <Switch
            checked={is_on}
            onChange={toggle}
        />
    </div>
}

export function DeviceForm({ device, onClose }: { device?: Device, onClose: () => void }) {
    const [actor, setActor] = React.useState(device?.actor)
    const ActorForm = actor && ActorForms[actor as keyof typeof ActorForms]
    const saveDevice = useDevices(x => x.save)

    const save = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const new_device = {
            ...device,
            name: data.get('name') as string,
            actor: data.get('actor') as string,
            actor_data: data.get('actor_data') as string,
            kind: data.get('kind') as string,
            traits: JSON.parse(data.get('traits') as string)
        }
        const res = await saveDevice(new_device)
        if (res) onClose()
    }, [])

    return <form onSubmit={save} onReset={onClose}>
        <DialogTitle>{device ? "Gerät bearbeiten" : "Gerät erstellen"}</DialogTitle>
        <DialogContent>
            <TextField fullWidth variant="standard" label="Gerätename" defaultValue={device?.name ?? "Neues Gerät"} name="name" sx={{ my: 2 }} />

            <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel id="kind-label">Gerätetyp</InputLabel>
                <Select labelId="kind-label" name="kind" defaultValue={device?.kind} label="Gerätetyp">
                    {Object.entries(device_kinds).map(([kind, name]) =>
                        <MenuItem key={kind} value={kind}>{name}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel id="actor-label">Akteur</InputLabel>
                <Select fullWidth labelId="actor-label" name="actor" label="Akteur"
                    value={actor} onChange={e => setActor(e.target.value)}>
                    {Object.keys(ActorForms).map(actor => <MenuItem key={actor} value={actor}>{actor}</MenuItem>)}
                </Select>
            </FormControl>

            {ActorForm && <ActorForm device={device} />}
        </DialogContent>
        <DialogActions>
            <Button type="reset">Abbrechen</Button>
            <Button type="submit" variant="outlined">Speichern</Button>
        </DialogActions>
    </form>
}

export function DeviceView({ device, disableEditing = false }: { device: Device, disableEditing?: boolean }) {
    const globalEditing = useModes(x => x.editing) && !disableEditing
    const [editingThis, setEditingThis] = React.useState(false)

    return <Box className="deviceFrame">
        <style jsx>{`                
            .deviceFrame {
                break-inside: avoid;
                padding: 1em;
            }
            .device {
                position: relative;
                border: 1px solid silver;
            }
            .editing :global(.MuiSwitch-root) {
                pointer-events: none;
            }
            @keyframes blink {
                0% { opacity: 0.5; }
                50% { opacity: 1; }
                100% { opacity: 0.5; }
            }
            .veil {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(128, 128, 128, 0.25);
                animation: blink 1s linear infinite;
                cursor: pointer;
            }
            h3 {
                font-weight: normal;
                color: var(--primary-color);
            }
        `}</style>
        <Box className={globalEditing ? "device editing" : "device"} sx={{ py: 2 }}>
            {/* <TypeIcon type={device.type} /> */}
            <Typography variant="h6">{device.name}</Typography>

            <Divider sx={{ my: 1 }} />

            <OnOffView device={device} />
            {/* <ModesView device={device} /> */}

            {globalEditing && <div className="veil" onClick={() => setEditingThis(!editingThis)} />}
        </Box>

        <Dialog open={editingThis} onClose={() => setEditingThis(false)}>
            <DeviceForm device={device} onClose={() => setEditingThis(false)} />
        </Dialog>
    </Box>
}

export function MultiDeviceView({ devices, disableEditing = false }: { devices: Device[], disableEditing?: boolean }) {
    return <div className="devices">
        <style jsx>{`
            .devices {
                column-width: 200px;
                column-gap: 0;
            }            
        `}</style>
        {devices.map(device =>
            <DeviceView key={device.id} {...{ device, disableEditing }} />)}
    </div>
}