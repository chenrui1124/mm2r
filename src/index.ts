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
