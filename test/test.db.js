const db = require('../lib/db')

async function run() {
    let template = await db.getTemplate()
    let result = await template.execute('SELECT * FROM broadcast.base_user where name=? and address=?', ['习大大', '美国'])
    console.log(result.results)
}

run()

