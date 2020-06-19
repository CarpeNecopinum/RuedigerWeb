import React from 'react';
import './App.scss';
import { RuedigerProvider } from './RuedigerContext';
import GroupsScreen from './views/GroupsScreen';

function App() {
    return (
        <RuedigerProvider url="http://raspberrypi:8080">
            <div className="App">
                <GroupsScreen />
            </div>
        </RuedigerProvider>
    );
}

export default App;
