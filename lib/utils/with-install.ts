import type { App, Plugin } from 'vue'

export function withInstall<T>(component: T, options?: { prefix?: string; useFileName?: boolean }) {
    ;(<T & Plugin>component).install = (app: App) => {
        app.component(
            `${options?.prefix ?? ''}${(<any>component)[options?.useFileName ? '__name' : 'name']}`,
            <any>component
        )
    }

    return component as T & Plugin
}
