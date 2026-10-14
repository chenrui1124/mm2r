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

//#region KeepType
declare const keepType: unique symbol

/**
 * A marker for `OverrideDocs`: replace a property's documentation while keeping its original type.
 * Only meaningful inside an `OverrideDocs` documentation shape.
 *
 * @since 0.4.0
 * @public
 */
export type KeepType = typeof keepType
//#endregion

//#region OverrideDocs
type DocLeaf =
  | Function
  | readonly unknown[]
  | Date
  | RegExp
  | Error
  | PromiseLike<unknown>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | WeakMap<WeakKey, unknown>
  | WeakSet<WeakKey>
  | ArrayBufferLike
  | ArrayBufferView

type IsDocObject<T> =
  IsAny<T> extends true
    ? false
    : [T] extends [never]
      ? false
      : T extends object
        ? T extends DocLeaf
          ? false
          : { [K in keyof T]: T[K] } extends T
            ? true
            : false
        : false

// Exclude index signatures, including template literal patterns.
type DeclaredProperties<T> = {
  [K in keyof T as {} extends Record<K, never> ? never : K]: T[K]
}

type UnionKeys<T> = T extends unknown ? keyof DeclaredProperties<T> : never

type UnionValue<T, K extends PropertyKey> = T extends unknown ? T[Extract<K, keyof T>] : never

type DocShape<T> =
  IsDocObject<T> extends true
    ? { [K in UnionKeys<T>]?: KeepType | DocShape<NonNullable<UnionValue<T, K>>> }
    : never

// Reject extra keys at every depth, even when valid keys are also present.
type ValidateDocs<T, D> = {
  [K in keyof D]: K extends UnionKeys<T> ? ValidateDocValue<UnionValue<T, K>, D[K]> : never
}

type ValidateDocValue<T, D> = D extends KeepType | undefined
  ? D
  : IsDocObject<NonNullable<T>> extends true
    ? ValidateDocs<NonNullable<T>, D>
    : never

type ResolveDoc<T, D> = [Exclude<D, undefined>] extends [KeepType]
  ? T
  : T extends object
    ? OverrideDocObject<T, Exclude<D, undefined>>
    : T

// Take JSDoc from D and value types from T; restore T's modifiers separately.
type DocProperties<T, D> = {
  -readonly [K in keyof D]-?: ResolveDoc<Required<T>[K & keyof T], D[K]>
}

type WithDocModifiers<T, D> = Pick<D, Extract<Exclude<RequiredKeys<T>, ReadonlyKeys<T>>, keyof D>> &
  Readonly<Pick<D, Extract<RequiredKeys<T> & ReadonlyKeys<T>, keyof D>>> &
  Partial<Pick<D, Extract<Exclude<OptionalKeys<T>, ReadonlyKeys<T>>, keyof D>>> &
  Readonly<Partial<Pick<D, Extract<OptionalKeys<T> & ReadonlyKeys<T>, keyof D>>>>

// Unlike Omit, this retains explicit properties alongside index signatures.
type UndocumentedProperties<T, D> = {
  [K in keyof T as K extends keyof D ? never : K]: T[K]
}

type OverrideDocObject<T, D> = T extends unknown
  ? Extract<keyof D, keyof T> extends never
    ? T
    : UndocumentedProperties<T, D> &
        WithDocModifiers<Pick<T, Extract<keyof D, keyof T>>, DocProperties<T, D>>
  : never

/**
 * Replace property JSDoc using `D`, preserving types and modifiers.
 * Use `KeepType` for a property or a nested object to update its children's docs.
 *
 * Only public object shapes are accepted at the root. Functions, arrays, tuples,
 * common built-ins, and classes with private/protected members require `KeepType`.
 * Unions containing these leaves or non-nullish primitives also require `KeepType`.
 * Index signatures cannot be documented. Public-only classes are treated as object shapes.
 *
 * @since 0.4.0
 * @public
 */
export type OverrideDocs<T extends object, D extends object & DocShape<T> & ValidateDocs<T, D>> =
  IsAny<D> extends true ? T : [D] extends [never] ? T : OverrideDocObject<T, D>
//#endregion
