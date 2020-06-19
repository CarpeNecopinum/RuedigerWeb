import { types, flow, getParent, generateId, applySnapshot, resolveIdentifier } from 'mobx-state-tree'
import { observable } from 'mobx'

import Device from './Device.js'

const Group = types.model('Group', {
    name: "",
    deviceIds: types.array(types.string)
}).views((self) => ({
    get members() {
        const ruediger = getParent(self, 2)
        return self.deviceIds.map(id => resolveIdentifier(Device, ruediger, id))
    },
    includes: ({ id }) => self.deviceIds.includes(id)

})).actions((self) => ({
    changeName: (name) => {
        console.log(self)
        self.name = name
    },
    replace: ({ name, members }) => {
        self.name = name
        self.members = members
    },
    addDevice: ({ id }) => (self.deviceIds.includes(id) || self.deviceIds.push(id)),
    removeDevice: ({ id }) => self.deviceIds.splice(self.deviceIds.indexOf(id), 1)
}))

export default Group;
