type Primitive = string | number | boolean | bigint | symbol | undefined | null

export type DeepNonNullable<T> = T extends Primitive
	? NonNullable<T>
	: T extends {}
	? { [K in keyof T]: DeepNonNullable<T[K]> }
	: NonNullable<T>
