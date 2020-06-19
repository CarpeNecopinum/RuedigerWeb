export default async function post_json(url, data) {
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
