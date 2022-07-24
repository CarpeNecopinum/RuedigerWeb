import React from 'react'
import { ReusableProvider } from 'reusable'
import './App.scss'
import { DevicesScreen } from './views/DevicesScreen'

import { Devices, GroupSharp, Help } from '@mui/icons-material'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import { Route } from 'react-router-dom'
import './model/useDevices'
import './model/useGroups'
import './model/useModes'
import { GroupsScreen } from './views/GroupsScreen'

function AboutScreen() {
    return <h1>About or something</h1>
}

type Route = {
    path: string
    component: React.ComponentType<any>
}
function SlideyNavigation({ routes, current }: { routes: Route[], current: string }) {
    const current_index = routes.findIndex(r => r.path === current)
    const shift = { transform: `translateX(${-100 * current_index}%)` }

    return <div className="nav-container">
        <style>{`
            .nav-container {
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: row;
            }
            .screen {
                flex-shrink: 0;
                transition: transform 0.5s;
                height: 100%;
                width: 100%;
            }
        `}</style>

        {routes.map((r, i) => <div key={r.path} className="screen" style={shift}>
            <r.component />
        </div>)}
    </div >
}

function App() {
    const [screen, setScreen] = React.useState('/devices');

    return (
        <ReusableProvider>
            <div className="App">
                <SlideyNavigation current={screen} routes={[
                    { path: '/devices', component: DevicesScreen },
                    { path: '/groups', component: GroupsScreen },
                    { path: '/about', component: AboutScreen }
                ]} />

                <BottomNavigation
                    value={screen}
                    onChange={(_, newValue) => {
                        setScreen(newValue);
                    }}
                    showLabels
                >
                    <BottomNavigationAction label="Geräte" value="/devices" icon={<Devices />} />
                    <BottomNavigationAction label="Favorites" value="/groups" icon={<GroupSharp />} />
                    <BottomNavigationAction label="Sonstiges" value="/about" icon={<Help />} />
                </BottomNavigation>
            </div>
        </ReusableProvider>
    );
}

export default App;
