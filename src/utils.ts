export async function post_json(url: RequestInfo | URL, data: any) {
    if (typeof data != "string")
        data = JSON.stringify(data)

    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
}

export async function fetch_json(url: RequestInfo | URL) {
    const res = await fetch(url)
    console.debug(res)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    return await res.json()
}

export function pick<T extends object, KS extends keyof T>(item: T, ...keys: KS[]) {
    const result = {} as Pick<T, KS>
    for (const key of keys) {
        result[key] = item[key]
    }
    return result
}