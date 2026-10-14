# MM2R

This is a TypeScript utility type library.

The name "MM2R" comes from the game "Metal Max 2 Reload", which is an excellent RPG game.

[简体中文](./README.zh-CN.md)

## Usage

- [Equal](#equal)
- [MaybeReadonly](#maybereadonly)
- [Without](#without)
- [Either](#either)
- [ConcreteByKeys](#concretebykeys)
- [OnlyOneKey](#onlyonekey)
- [OptionalKeys](#optionalkeys)
- [RequiredKeys](#requiredkeys)
- [IsAny](#isany)
- [ReadonlyKeys](#readonlykeys)
- [KeepType](#keeptype)
- [OverrideDocs](#overridedocs)

### Equal

`Equal<A, B>`

Since: `0.0.0-alpha.0`.

Return `true` if `A` and `B` are mutually assignable; otherwise, return `never`.

```ts
import type { Equal } from 'mm2r'

type Same = Equal<{ id: number }, { id: number }> // true
type Different = Equal<string, number> // never
```

### MaybeReadonly

`MaybeReadonly<T>`

Since: `0.1.0-alpha.0`.

Accept `T` or `Readonly<T>` — don't care about mutability.

```ts
import type { MaybeReadonly } from 'mm2r'

const mutable: string[] = ['Alice']
const readonly: readonly string[] = ['Bob']

const first: MaybeReadonly<string[]> = mutable
const second: MaybeReadonly<string[]> = readonly
```

### Without

`Without<T extends object, U extends object>`

Since: `0.2.0`.

Create optional properties of type `never` for keys present in `T` but not in `U`.

```ts
import type { Without } from 'mm2r'

type NoName = Without<{ id: number; name: string }, { id: number }>
// { name?: never }

const valid: NoName = {}
// @ts-expect-error: name cannot be a string.
const invalid: NoName = { name: 'Alice' }
```

### Either

`Either<T, U>`

Since: `0.2.0`.

A strict union — when both are objects, you get one or the other, never a mix. Otherwise a plain `T | U`.

```ts
import type { Either } from 'mm2r'

type Contact = Either<{ email: string }, { phone: string }>

const byEmail: Contact = { email: 'alice@example.com' }
const byPhone: Contact = { phone: '123456789' }
// @ts-expect-error: Choose email or phone, not both.
const invalid: Contact = { email: 'alice@example.com', phone: '123456789' }

type Value = Either<string, number> // string | number
```

### ConcreteByKeys

`ConcreteByKeys<T, K extends keyof T>`

Since: `0.3.0`.

Make properties in `K` required and exclude `null` and `undefined` from their value types.
Other properties retain their value types but become required and writable.

```ts
import type { ConcreteByKeys } from 'mm2r'

type User = {
  name?: string | null
  readonly age?: number | null
}

type ConcreteUser = ConcreteByKeys<User, 'name'>
// { name: string } & { age: number | null | undefined }

const user: ConcreteUser = { name: 'Alice', age: undefined }
user.age = 30
```

### OnlyOneKey

`OnlyOneKey<T, Keys extends keyof T = keyof T>`

Since: `0.3.0`.

Require exactly one property from `Keys` and make all other properties in `T` optional `never`.
Useful for mutually exclusive options. `Keys` defaults to all keys of `T`.

```ts
import type { OnlyOneKey } from 'mm2r'

type Lookup = OnlyOneKey<{ id: number; email: string }>

const byId: Lookup = { id: 1 }
const byEmail: Lookup = { email: 'alice@example.com' }
// @ts-expect-error: Exactly one property is required.
const missing: Lookup = {}
// @ts-expect-error: The properties are mutually exclusive.
const mixed: Lookup = { id: 1, email: 'alice@example.com' }
```

### OptionalKeys

`OptionalKeys<T>`

Since: `0.4.0`.

Get a union of the keys in `T` that can be omitted.

```ts
import type { OptionalKeys } from 'mm2r'

type User = {
  id: number
  name?: string
  email?: string
  value: string | undefined
}

type Keys = OptionalKeys<User> // 'name' | 'email'
```

### RequiredKeys

`RequiredKeys<T>`

Since: `0.4.0`.

Get a union of the keys in `T` that must be present.

```ts
import type { RequiredKeys } from 'mm2r'

type User = {
  id: number
  name?: string
  value: string | undefined
}

type Keys = RequiredKeys<User> // 'id' | 'value'
```

### IsAny

`IsAny<T>`

Since: `0.4.0`.

Return `true` if `T` resolves to `any`; otherwise, return `false`.
Does not inspect nested types.

```ts
import type { IsAny } from 'mm2r'

type AnyValue = IsAny<any> // true
type UnknownValue = IsAny<unknown> // false
type NestedValue = IsAny<{ value: any }> // false
```

### ReadonlyKeys

`ReadonlyKeys<T>`

Since: `0.4.0`.

Extract shallow readonly keys from object types, including public class members and getter-only properties.
A readonly property value does not make the property itself readonly.

Unions inspect only shared keys; a key can be readonly in just one branch.
Index signatures may obscure individual properties. Arrays and tuples are unsupported.

```ts
import type { ReadonlyKeys } from 'mm2r'

type User = {
  readonly id: number
  readonly name?: string
  tags: readonly string[]
}

type Keys = ReadonlyKeys<User> // 'id' | 'name'
```

### KeepType

`KeepType`

Since: `0.4.0`.

A marker for `OverrideDocs`: replace a property's documentation while keeping its original type.
Only meaningful inside an `OverrideDocs` documentation shape.

```ts
import type { KeepType, OverrideDocs } from 'mm2r'

type User = { readonly id: number }

type DocumentedUser = OverrideDocs<
  User,
  {
    /** The user's unique identifier. */
    id: KeepType
  }
>

const user: DocumentedUser = { id: 1 }
// id remains readonly and has type number.
```

### OverrideDocs

`OverrideDocs<T, D>`

Since: `0.4.0`.

Replace property JSDoc using `D`, preserving types and modifiers.
Use `KeepType` for a property or a nested object to update its children's docs.

Only public object shapes are accepted at the root. Functions, arrays, tuples,
common built-ins, and classes with private/protected members require `KeepType`.
Unions containing these leaves or non-nullish primitives also require `KeepType`.
Index signatures cannot be documented. Public-only classes are treated as object shapes.

```ts
import type { KeepType, OverrideDocs } from 'mm2r'

type User = {
  readonly id: number
  profile?: { name: string }
  createdAt: Date
}

type DocumentedUser = OverrideDocs<
  User,
  {
    /** The user's unique identifier. */
    id: KeepType
    profile: {
      /** The name displayed in the UI. */
      name: KeepType
    }
    /** When the account was created. */
    createdAt: KeepType
  }
>

const user: DocumentedUser = { id: 1, createdAt: new Date() }
// id remains readonly, profile remains optional, and createdAt remains Date.
```
