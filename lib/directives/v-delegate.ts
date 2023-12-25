import type { DirectiveBinding, ObjectDirective } from 'vue'

import { hasProp } from 'mm3'

type DelegatedEl = HTMLElement & { [p: `$$${string}`]: (e?: Event) => void }

function vDelegateCreator(): ObjectDirective {
    const $events: (keyof HTMLElementEventMap)[] = [
        'click',
        'mousedown',
        'mouseup',
        'pointerdown',
        'pointerup',
        'touchstart',
        'touchend'
    ] as const

    const $status = $events.reduce<{ [p in (typeof $events)[number]]?: boolean }>((result, v) => {
        result[v] = false
        return result
    }, {})

    function $addListener(event: keyof typeof $status) {
        document.body.addEventListener(event, (e: Event) => {
            const t = <DelegatedEl>e.target
            t.$$click && t.$$click(e)
        })
    }

    return {
        created: (el: DelegatedEl, { arg, value }: DirectiveBinding) => {
            if (arg && hasProp($status, arg)) {
                if (!$status[<keyof typeof $status>arg]) {
                    $addListener(<keyof typeof $status>arg)
                    $status[<keyof typeof $status>arg] = true
                }
                typeof value == 'function' && (el.$$click = value)
            }
        }
    }
}

export const vDelegate = vDelegateCreator()
