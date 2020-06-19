import React from 'react';
import { Button, Switch } from '@material-ui/core';
import { observer } from 'mobx-react'

import RuedigerContext from '../RuedigerContext'
import { Text } from './polyfills'


const TypeIcon = ({ type }) => {
    let typename = type.split(".").pop()
    let iconname = {
        "LIGHT": "lightbulb-on-outline",
        "OUTLET": "power",
        "HEATER": "desktop-tower-monitor",
        "SWITCH": "light-switch"
    }[typename];

    // if (iconname) {
    //     return <Icon name={iconname} size={32} style={style.deviceIcon} />
    // } else {
    return <Text>{typename}</Text>
    // }
}

const OnOffView = observer(({ device }) => {
    const onToggle = React.useCallback((e) => {
        device.traits.onOff.switch(e.target.checked)
    }, [device]);

    if (device.traits.onOff) {
        return <div className="onOffView">
            <Text>{device.traits.onOff.current ? "An" : "Aus"}</Text>
            <Switch
                checked={device.traits.onOff.current}
                onChange={onToggle}
            />
        </div>
    }
    return null
})

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

const DeviceView = observer(({ device }) => {
    const { execute } = React.useContext(RuedigerContext)

    return (
        <div className="deviceFrame">
            <div className="device">
                {/* <TypeIcon type={device.type} /> */}
                <h3>{device.name}</h3>

                <OnOffView device={device} />
                <ModesView device={device} />
            </div>
        </div>)
})

export default DeviceView
