import React from 'react'
import Ruediger from './model/Ruediger'

const RuedigerContext = React.createContext('')
export default RuedigerContext;


export function RuedigerProvider({ url, children }) {
    const ruediger = React.useMemo(() => {
        const model = Ruediger.create({ url })
        model.refresh()
        return model
    }, [url])

    React.useEffect(() => {
        const timer = setInterval(() => ruediger.queryAllStates(), 1000);
        return () => clearInterval(timer);
    }, [ruediger])

    return (
        <RuedigerContext.Provider value={ruediger}>
            {children}
        </RuedigerContext.Provider>
    )
}
