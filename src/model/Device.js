import { types, flow, getParent } from 'mobx-state-tree'
import { observable } from 'mobx'
import post_json from '../utils/post_json'

const Setting = types.model('Setting', {
    id: "",
    name: ""
})

const Mode = types.model('Mode', {
    id: "",
    name: "",
    settings: types.array(Setting)
}).views(self => ({
    get current() {
        const device = getParent(self, 4)
        return device.state?.currentModeSettings?.[self.id]
    }
})).actions(self => ({
    select: flow(function* (setting) {
        const device = getParent(self, 4)
        const currentModeSettings = {
            ...device.state?.currentModeSettings,
            [self.id]: setting
        }
        device.setState({
            ...device.state,
            currentModeSettings
        })
        yield device.execute({
            command: "action.devices.commands.SetModes",
            params: {
                updateModeSettings: {
                    [self.id]: setting
                }
            }
        })
    })
}))

const ModesTrait = types.model('ModesTrait', {
    modes: types.array(Mode)
}).actions(self => ({
    updateFromSync(attributes) {
        self.modes = attributes.availableModes.map(mode => ({
            id: mode.name,
            name: mode.name_values?.[0]?.name_synonym?.[0] || mode.name,
            settings: mode.settings.map(x => ({
                id: x.setting_name,
                name: x.setting_values?.[0]?.setting_synonym?.[0] || x.setting_name
            }))
        }))
    }
}))

const OnOffTrait = types.model('OnOffTrait', {})
    .views(self => ({
        get current() {
            const device = getParent(self, 2)
            return device.state.on
        }
    }))
    .actions(self => ({
        switch: flow(function* (next) {
            const device = getParent(self, 2)
            device.setState({ ...device.state, on: next })
            yield device.execute({
                command: "action.devices.commands.OnOff",
                params: { on: next }
            })
        })
    }))

const Traits = types.model('Traits', {
    onOff: types.maybe(OnOffTrait),
    modes: types.maybe(ModesTrait)
}).actions(self => ({
    updateFromSync: (traits, attributes) => {
        (traits.includes("action.devices.traits.OnOff")) ?
            self.onOff = OnOffTrait.create({}) : self.onOff = undefined
        if (traits.includes("action.devices.traits.Modes")) {
            self.modes = ModesTrait.create({})
            self.modes.updateFromSync(attributes)
        } else {
            self.modes = undefined
        }
    }
}))

const Device = types.model('Device', {
    id: types.identifier,
    name: "",
    type: "",
    state: types.frozen({}),
    traits: types.optional(Traits, {}),
}).actions(self => ({
    updateFromSync: (info) => {
        self.name = info.name.name
        self.type = info.type
        self.traits.updateFromSync(info.traits, info.attributes)
    },
    setState: (state) => {
        self.state = state
    },
    queryState: flow(function* () {
        const ruediger = getParent(self, 2)
        yield ruediger.queryStates([self.id])
    }),
    execute: flow(function* (command) {
        const ruediger = getParent(self, 2)
        yield ruediger.execute([{
            devices: [{ id: self.id }],
            execution: [command]
        }])
        yield self.queryState()
    })
}))

export default Device;