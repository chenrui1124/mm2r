# MM2R

一个 TypeScript 工具类型库。

## 用法

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

起始版本：`0.0.0-alpha.0`。

如果 `A` 和 `B` 可以相互赋值，返回 `true`；否则返回 `never`。

```ts
import type { Equal } from 'mm2r'

type Same = Equal<{ id: number }, { id: number }> // true
type Different = Equal<string, number> // never
```

### MaybeReadonly

`MaybeReadonly<T>`

起始版本：`0.1.0-alpha.0`。

接受 `T` 或 `Readonly<T>`，无需区分是否只读。

```ts
import type { MaybeReadonly } from 'mm2r'

const mutable: string[] = ['Alice']
const readonly: readonly string[] = ['Bob']

const first: MaybeReadonly<string[]> = mutable
const second: MaybeReadonly<string[]> = readonly
```

### Without

`Without<T extends object, U extends object>`

起始版本：`0.2.0`。

对于存在于 `T` 但不存在于 `U` 的键，创建类型为 `never` 的可选属性。

```ts
import type { Without } from 'mm2r'

type NoName = Without<{ id: number; name: string }, { id: number }>
// { name?: never }

const valid: NoName = {}
// @ts-expect-error: name 不能是字符串。
const invalid: NoName = { name: 'Alice' }
```

### Either

`Either<T, U>`

起始版本：`0.2.0`。

严格联合类型：当两者都是对象时，只能选择其中一种，不能混用；否则为普通的 `T | U`。

```ts
import type { Either } from 'mm2r'

type Contact = Either<{ email: string }, { phone: string }>

const byEmail: Contact = { email: 'alice@example.com' }
const byPhone: Contact = { phone: '123456789' }
// @ts-expect-error: email 和 phone 只能选择一个。
const invalid: Contact = { email: 'alice@example.com', phone: '123456789' }

type Value = Either<string, number> // string | number
```

### ConcreteByKeys

`ConcreteByKeys<T, K extends keyof T>`

起始版本：`0.3.0`。

将 `K` 中的属性设为必填，并从其值类型中排除 `null` 和 `undefined`。
其余属性保留原有值类型，但会变为必填且可写。

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

起始版本：`0.3.0`。

要求恰好提供 `Keys` 中的一个属性，并将 `T` 中的其余所有属性设为可选的 `never`。
适用于互斥选项。`Keys` 默认包含 `T` 的所有键。

```ts
import type { OnlyOneKey } from 'mm2r'

type Lookup = OnlyOneKey<{ id: number; email: string }>

const byId: Lookup = { id: 1 }
const byEmail: Lookup = { email: 'alice@example.com' }
// @ts-expect-error: 必须提供恰好一个属性。
const missing: Lookup = {}
// @ts-expect-error: 这些属性互斥。
const mixed: Lookup = { id: 1, email: 'alice@example.com' }
```

### OptionalKeys

`OptionalKeys<T>`

起始版本：`0.4.0`。

获取 `T` 中可以省略的属性键组成的联合类型。

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

起始版本：`0.4.0`。

获取 `T` 中必须存在的属性键组成的联合类型。

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

起始版本：`0.4.0`。

如果 `T` 解析为 `any`，返回 `true`；否则返回 `false`。
不会检查嵌套类型。

```ts
import type { IsAny } from 'mm2r'

type AnyValue = IsAny<any> // true
type UnknownValue = IsAny<unknown> // false
type NestedValue = IsAny<{ value: any }> // false
```

### ReadonlyKeys

`ReadonlyKeys<T>`

起始版本：`0.4.0`。

提取对象类型中浅层的只读属性键，包括类的公开成员和仅有 getter 的属性。
属性的值是只读类型，并不意味着该属性本身只读。

对于联合类型，只检查各分支共有的键；某个键只需在其中一个分支中为只读。
索引签名可能掩盖单独声明的属性。不支持数组和元组。

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

起始版本：`0.4.0`。

用于 `OverrideDocs` 的标记：替换属性文档，同时保留属性的原始类型。
仅在 `OverrideDocs` 的文档结构中有意义。

```ts
import type { KeepType, OverrideDocs } from 'mm2r'

type User = { readonly id: number }

type DocumentedUser = OverrideDocs<
  User,
  {
    /** 用户的唯一标识符。 */
    id: KeepType
  }
>

const user: DocumentedUser = { id: 1 }
// id 仍然是只读属性，类型为 number。
```

### OverrideDocs

`OverrideDocs<T, D>`

起始版本：`0.4.0`。

使用 `D` 替换属性的 JSDoc，同时保留类型及修饰符。
对单个属性使用 `KeepType`；也可以使用嵌套对象更新子属性的文档。

根类型仅接受公开的对象结构。函数、数组、元组、常见内置类型，以及含有私有或受保护成员的类，均需使用 `KeepType`。
包含这些叶子类型或除 `null` 和 `undefined` 之外的原始类型的联合类型也需使用 `KeepType`。
无法为索引签名编写文档。仅含公开成员的类按对象结构处理。

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
    /** 用户的唯一标识符。 */
    id: KeepType
    profile: {
      /** 界面中显示的名称。 */
      name: KeepType
    }
    /** 账户创建时间。 */
    createdAt: KeepType
  }
>

const user: DocumentedUser = { id: 1, createdAt: new Date() }
// id 仍然只读，profile 仍然可选，createdAt 仍然是 Date。
```
