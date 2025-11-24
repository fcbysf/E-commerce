import { createContext } from "react";

export const Context = createContext()

const Provider =({children})=>{
const api = 'http://localhost:8000/api/'
return(
    <Context.Provider value={{api}}>
        {children}
    </Context.Provider>
)
}
export default Provider

