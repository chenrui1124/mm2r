import { computed, ref } from 'vue'

export function useIterate<T>(each: T[] | readonly T[], init: number = 0) {
    const index = ref<number>(init < each.length && init >= 0 ? init : 0),
        item = computed<T>(() => each[index.value])

    function $next() {
        index.value = (index.value + 1) % each.length
    }

    function next() {
        requestAnimationFrame ? requestAnimationFrame($next) : $next()
    }

    function nextWith(run: (item: T, index: number) => void) {
        return () => {
            next()
            run(item.value, index.value)
        }
    }

    return { item, index, next, nextWith }
}
