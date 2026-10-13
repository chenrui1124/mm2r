/**
 * Make keys from U forbidden (optional never) in T.
 *
 * @public
 */
export type Without<T extends object, U extends object> = {
  [P in Exclude<keyof T, keyof U>]?: never
}

/**
 * A strict union — when both are objects, you get one or the other, never a mix. Otherwise a plain `T | U`.
 *
 * @public
 */
export type Either<T, U> = T extends object
  ? U extends object
    ? (T & Without<U, T>) | (U & Without<T, U>)
    : T | U
  : T | U

/**
 * Check if two types are exactly the same. Returns `true` or `never`.
 *
 * @public
 */
export type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never

/**
 * Accept `T` or `Readonly<T>` — don't care about mutability.
 *
 * @public
 */
export type MaybeReadonly<T> = T | Readonly<T>

/**
 * Make specific keys concrete — required and stripped of `null` / `undefined`.
 * Other keys stay as-is. Useful after runtime validation to assert the field is real.
 *
 * @public
 */
export type ConcreteByKeys<T, K extends keyof T> = {
  [P in K]-?: NonNullable<T[P]>
} & {
  [P in Exclude<keyof T, K>]: T[P]
}

/**
 * Require exactly one of the given keys, and forbid all others (set to `never`).
 * Perfect for discriminated unions where only one variant should be present at a time.
 *
 * @public
 */
export type OnlyOneKey<T, Keys extends keyof T = keyof T> = Keys extends keyof T
  ? Required<Pick<T, Keys>> & Partial<Record<Exclude<keyof T, Keys>, never>>
  : never

/**
 * Get a union of the keys in `T` that can be omitted.
 *
 * @public
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

/**
 * Get a union of the keys in `T` that must be present.
 *
 * @public
 */
export type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>
