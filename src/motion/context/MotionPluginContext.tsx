import * as React from "react"
import { createContext, useContext, useRef, ReactNode } from "react"
import { Point } from "../../events/types"

export interface MotionPlugins {
    transformPagePoint: (point: Point) => Point
}

export interface MotionPluginProps extends MotionPlugins {
    children?: ReactNode
}

/**
 * @internal
 */
export const MotionPluginContext = createContext<MotionPlugins>({
    transformPagePoint: p => p,
})

/**
 * @internal
 * @internalremarks For now I think this should remain a private API for our own use
 * until we can figure out a nicer way of allowing people to add these
 */
export function MotionPlugins({ children, ...props }: MotionPluginProps) {
    const pluginContext = useContext(MotionPluginContext)
    const value = useRef({ ...pluginContext }).current

    // Mutative to prevent triggering rerenders in all listening
    // components every time this component renders
    for (const key in props) {
        value[key] = props[key]
    }

    return (
        <MotionPluginContext.Provider value={value}>
            {children}
        </MotionPluginContext.Provider>
    )
}
