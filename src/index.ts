//#region Equal
/**
 * Return `true` if `A` and `B` are mutually assignable; otherwise, return `never`.
 *
 * @since 0.0.0-alpha.0
 * @public
 */
export type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never
//#endregion

//#region MaybeReadonly
/**
 * Accept `T` or `Readonly<T>` — don't care about mutability.
 *
 * @since 0.1.0-alpha.0
 * @public
 */
export type MaybeReadonly<T> = T | Readonly<T>
//#endregion

//#region Without
/**
 * Create optional properties of type `never` for keys present in `T` but not in `U`.
 *
 * @since 0.2.0
 * @public
 */
export type Without<T extends object, U extends object> = {
  [P in Exclude<keyof T, keyof U>]?: never
}
//#endregion

//#region Either
/**
 * A strict union — when both are objects, you get one or the other, never a mix. Otherwise a plain `T | U`.
 *
 * @since 0.2.0
 * @public
 */
export type Either<T, U> = T extends object
  ? U extends object
    ? (T & Without<U, T>) | (U & Without<T, U>)
    : T | U
  : T | U
//#endregion

//#region ConcreteByKeys
/**
 * Make properties in `K` required and exclude `null` and `undefined` from their value types.
 * Other properties retain their value types but become required and writable.
 *
 * @since 0.3.0
 * @public
 */
export type ConcreteByKeys<T, K extends keyof T> = {
  [P in K]-?: NonNullable<T[P]>
} & {
  [P in Exclude<keyof T, K>]: T[P]
}
//#endregion

//#region OnlyOneKey
/**
 * Require exactly one property from `Keys` and make all other properties in `T` optional `never`.
 * Useful for mutually exclusive options.
 *
 * @since 0.3.0
 * @public
 */
export type OnlyOneKey<T, Keys extends keyof T = keyof T> = Keys extends keyof T
  ? Required<Pick<T, Keys>> & Partial<Record<Exclude<keyof T, Keys>, never>>
  : never
//#endregion

//#region OptionalKeys
/**
 * Get a union of the keys in `T` that can be omitted.
 *
 * @since 0.4.0
 * @public
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
//#endregion

//#region RequiredKeys
/**
 * Get a union of the keys in `T` that must be present.
 *
 * @since 0.4.0
 * @public
 */
export type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>
//#endregion

//#region IsAny
/**
 * Return `true` if `T` resolves to `any`; otherwise, return `false`.
 * Does not inspect nested types.
 *
 * @since 0.4.0
 * @public
 */
export type IsAny<T> = 0 extends 1 & T ? true : false
//#endregion

//#region ReadonlyKeys
type IsReadonly<T> =
  (<U>() => U extends T ? true : false) extends <U>() => U extends Readonly<T> ? true : false
    ? true
    : false

/**
 * Extract shallow readonly keys from object types, including public class members and getter-only properties.
 * A readonly property value does not make the property itself readonly.
 *
 * Unions inspect only shared keys; a key can be readonly in just one branch.
 * Index signatures may obscure individual properties. Arrays and tuples are unsupported.
 *
 * @since 0.4.0
 * @public
 */
export type ReadonlyKeys<T> = {
  [K in keyof T]-?: IsReadonly<Pick<T, K>> extends true ? K : never
}[keyof T]
//#endregion
