import {types, flow, getSnapshot, applySnapshot, onSnapshot} from 'mobx-state-tree'
import Device from './Device.js'
import Group from './Group.js'
import post_json from '../utils/post_json.js'

const Ruediger = types.model('Ruediger',{
    url: types.string,
    devices: types.array(Device),
    groups: types.array(Group)
}).views(self => ({
    findDevice: (id) => {
        for (const x of self.devices)
            if (x.id === id) return x
    }
})).actions(self => ({
    refreshDevices: flow(function*() {
        const res = yield post_json(`${self.url}/sync`, {requestId: 9000})
        const json = yield res.json()

        const devices = json.payload.devices

        // Remove devices that disappeared
        const id_set = new Set()
        devices.forEach((x) => id_set.add(x.id))
        self.devices = self.devices.filter(x=>id_set.has(x.id))

        // Update/Create devices
        devices.forEach(device => {
            const toBeUpdated = self.findDevice(device.id)
            if (toBeUpdated) {
                toBeUpdated.updateFromSync(device)
            } else {
                const newDevice = Device.create({id: device.id})
                newDevice.updateFromSync(device)
                self.devices.push(newDevice)
            }
        })
        yield self.queryAllStates()
    }),

    refreshGroups: flow(function*() {
        const res = yield fetch(`${self.url}/settings`)
        const json = yield res.json()
        applySnapshot(self.groups, json.groups)
    }),

    storeGroups: flow(function*() {
        const snap = getSnapshot(self.groups)
        yield post_json(`${self.url}/settings`, {groups: snap})
    }),

    refresh: flow(function*() {
        yield self.refreshDevices()
        yield self.refreshGroups()
    }),

    queryStates: flow(function*(ids) {
        const intent = ids.map(x => ({id: x}))
        const res = yield post_json(`${self.url}/query`, {
            requestId: 9001,
            inputs: [{payload: {devices: intent}}]
        })
        const json = yield res.json()
        const device_states = json.payload.devices
        self.devices.forEach(device => {
            const state = device_states[device.id]
            state && device.setState(state)
        })
    }),
    queryAllStates: flow(function*() {
        yield self.queryStates(self.devices.map(x => x.id))
    }),
    execute: flow(function*(commands) {
        const body = {
            requestId: 9000,
            inputs: [{payload: {commands}}]
        }
        const res = yield post_json(`${self.url}/execute`, body)
    }),
    addGroup: (group) => self.groups.push(group),
    afterCreate: () => onSnapshot(self.groups, self.storeGroups)
}))

export default Ruediger
