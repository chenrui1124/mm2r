type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

export type Either<T, U> = T | U extends object ? (T & Without<U, T>) | (U & Without<T, U>) : T | U

export type Equal<A, B> = A extends B ? (B extends A ? true : never) : never

export type MaybeReadonly<T> = T | Readonly<T>
