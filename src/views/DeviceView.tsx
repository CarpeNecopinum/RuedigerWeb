import { Box, Switch } from '@material-ui/core';
import React from "react";
import { Device, useDevices } from "../model/useDevices";
import { pick } from "../utils";
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

/*
const ModeView = observer(({ device, index }) => {
    const mode = device.traits.modes.modes[index]
    const [opened, setOpened] = React.useState(false)
    const open = React.useCallback(() => setOpened(true), [])
    const close = React.useCallback(() => setOpened(false), [])
    const current = mode.settings.find(x => x.id == mode.current) || { name: "unknown" }

    return (
        <React.Fragment>
            <Button
                onClick={open}>
                {mode.name}: {current.name}
            </Button>
            <div className={"modal" + (opened ? " active" : "")} onClick={close} >
                <div className="dialog">
                    <h1>Zustand ändern "{mode.name}"</h1>
                    <h2>auf Gerät "{device.name}"</h2>
                    <div className="options">
                        {mode.settings.map(setting => setting.id == "unknown" ? null :
                            <Button
                                className={(mode.current == setting.id) ? "contained" : "outlined"}
                                onClick={() => { mode.select(setting.id); close() }}
                                key={setting.id}>
                                {setting.name}
                            </Button>)}
                    </div>
                </div>
            </div>
        </React.Fragment>)
});

const ModesView = observer(({ device }) => {
    if (device.traits.modes) {
        return <div className="modes">
            {device.traits.modes.modes.map((m, i) => <ModeView key={m.id} device={device} index={i} />)}
        </div>
    }
    return null
})
*/

export function DeviceView({ device }: { device: Device }) {
    return <Box className="deviceFrame">
        <div className="device">
            {/* <TypeIcon type={device.type} /> */}
            <h3>{device.name}</h3>

            <OnOffView device={device} />
            {/* <ModesView device={device} /> */}
        </div>
    </Box>
}