import { computed, ref } from 'vue'

export function useIterate<ItemType>(each: ItemType[] | readonly ItemType[], init: number = 0) {
    const index = ref<number>(init < each.length && init >= 0 ? init : 0),
        item = computed<ItemType>(() => each[index.value])

    function $next() {
        index.value = (index.value + 1) % each.length
    }

    function next() {
        requestAnimationFrame ? requestAnimationFrame($next) : $next()
    }

    function nextWith(run: (item?: ItemType) => void) {
        next()
        run(item.value)
    }

    return { item, index, next, nextWith }
}
