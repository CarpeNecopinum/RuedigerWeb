import React from 'react';
import { observer } from 'mobx-react'
import { getSnapshot, applySnapshot, clone } from 'mobx-state-tree'

import RuedigerContext from '../RuedigerContext'

import { Button, Switch } from '@material-ui/core';

//import Ruediger from '../model/Ruediger'
import Group from '../model/Group'

import DeviceView from './DeviceView'


// const AddGroup = () => {
//     const ruediger = React.useContext(RuedigerContext)
//     const [model, setModel] = React.useState(null)
//     const openForm = React.useCallback(() => {
//         let group = Group.create({})
//         console.log(group)
//         setModel(group)
//     })
//     const createGroup = React.useCallback(() => {
//         ruediger.addGroup(model)
//         setModel(null)
//     })

//     return (<React.Fragment>
//         {(model != null) && <GroupEditForm
//             devices={ruediger.devices}
//             model={model}
//             onSave={createGroup}
//             onDismiss={() => setModel(null)}
//             title="Neue Gruppe erstellen" />}
//         <Button
//             style={{alignSelf: 'center', paddingHorizontal: 30, paddingVertical: 5, marginTop: 15}}
//             mode="contained"
//             onPress={openForm}>
//             Neue Gruppe
//         </Button>
//     </React.Fragment>)
// }

// const GroupDeviceCheckbox = observer(({group, device}) => {
//     const checked = group.includes(device)
//     const change = React.useCallback((next) => {
//         next ? group.addDevice(device) : group.removeDevice(device)
//         console.debug(group)
//     })


//     // <Switch style={{height: 40}} value={checked} onValueChange={change} />

//     return <View
//         style={{flexDirection: 'row', alignItems: 'center'}}>

//         <Text style={{flex: 1, lineHeight: 40}}>{device.name}</Text>
//         <Checkbox status={checked ? "checked" : "unchecked"} onPress={() => change(!checked)} />
//     </View>
// })

// const GroupEditForm = observer(({devices, model, onSave, onDismiss, title}) => {
//     return (
//     <Portal>
//     <Dialog onDismiss={onDismiss} visible={true}>
//         <Dialog.Title>{title || "Gruppe Bearbeiten"}</Dialog.Title>
//         <Dialog.Content>
//             <TextInput label={"Gruppenname"} value={model.name} onChangeText={(x) => model.changeName(x)}/>

//             <Dialog.ScrollArea>
//                 <ScrollView>
//                     {devices.map(d => <GroupDeviceCheckbox key={d.name} group={model} device={d} />)}
//                 </ScrollView>
//             </Dialog.ScrollArea>
//         </Dialog.Content>
//         <Dialog.Actions>
//             <Button onPress={onDismiss}>Abbrechen</Button>
//             <Button onPress={onSave}>Speichern</Button>
//         </Dialog.Actions>
//     </Dialog>
//     </Portal>
//     )
// })

const GroupView = observer(({ group }) => {
    const devices = React.useContext(RuedigerContext).devices
    const [workingCopy, setWorkingCopy] = React.useState(null)
    const edit = React.useCallback(() => setWorkingCopy(clone(group)))
    const dismiss = React.useCallback(() => setWorkingCopy(null))
    const save = React.useCallback(() => {
        applySnapshot(group, getSnapshot(workingCopy))
        setWorkingCopy(null)
    })

    const anySwitchable = !!group.members.find(x => x.traits.onOff)
    const anyEnabled = !!group.members.find(x => (x.traits.onOff && x.traits.onOff.current))
    const toggleAll = React.useCallback((e) => {
        const value = e.target.checked;
        group.members.forEach(x => x.traits.onOff?.switch(value))
    }, [group])

    const [showDevices, setShowDevices] = React.useState(false)
    const toggleShowDevices = React.useCallback(() => setShowDevices(!showDevices))

    console.debug(anyEnabled)

    return <div className="group">
        <div className="groupHeader">
            <Button onClick={toggleShowDevices}>{showDevices ? "-" : "+"}</Button>
            {/* <TouchableOpacity onPress={toggleShowDevices}>
                <Icon name={showDevices ? "chevron-up" : "chevron-down"} size={32} />
            </TouchableOpacity> */}
            <h2>{group.name}</h2>
            {anySwitchable &&
                <Switch
                    checked={anyEnabled}
                    onChange={toggleAll} />}
            <Button onClick={edit}>
                Edit
                {/* <Icon name="lead-pencil" size={32} /> */}
            </Button>
            {/* {workingCopy && <GroupEditForm
                devices={devices}
                model={workingCopy}
                onSave={save}
                onDismiss={dismiss}
                title={"Gruppe bearbeiten"} />} */}
        </div>
        <div className={"groupMembers " + (showDevices ? "active" : "inactive")}>
            {group.members.map((d) => <DeviceView key={d.id} device={d} />)}
        </div>
    </div >
})

const GroupsScreen = observer(() => {
    const ruediger = React.useContext(RuedigerContext)

    const [refreshing, setRefreshing] = React.useState(false)
    const onRefresh = React.useCallback(async () => {
        try {
            setRefreshing(true)
            await ruediger.refresh()
        } finally {
            setRefreshing(false)
        }
    }, [ruediger]);

    return (
        <div id="groups">
            {ruediger.groups.map(x => <GroupView group={x} />)}
        </div>
    )
})

export default GroupsScreen