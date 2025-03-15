export type Maybe<T> = T | null

export enum ResultType {
    Ok = 'Ok',
    Error = 'Err',
}

type ResultOk<T> = {
    resultType: ResultType.Ok
    result: T
    error: undefined
}

type ResultError = {
    resultType: ResultType.Error
    result: undefined
    error: string
}

export type Result<T> = ResultOk<T> | ResultError

export const Ok = <T>(result: T): Result<T> => ({
    result,
    error: undefined,
    resultType: ResultType.Ok,
})

export const Error = <T>(error: string): Result<T> => ({
    resultType: ResultType.Error,
    result: undefined,
    error,
})

export const isOk = <T>(result: Result<T>): result is ResultOk<T> =>
    result.error === undefined

export const isError = <T>(result: Result<T>): result is ResultError =>
    result.error !== undefined
