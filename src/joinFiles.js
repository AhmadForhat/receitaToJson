const fs = require('fs')

const data01 = require('../data01.json')
const data02 = require('../data02.json')
const data03 = require('../data03.json')
const data04 = require('../data04.json')
const data05 = require('../data05.json')
const data06 = require('../data06.json')
const data07 = require('../data07.json')
const data08 = require('../data08.json')
const data09 = require('../data09.json')

const saveJsonFile = (data, nomeArquivo) => {
    const obj = {
        data
    }
    const dataJson = JSON.stringify(obj)
    fs.writeFile(`${nomeArquivo}.json`, dataJson, 'utf8', () => console.log('feito'));
}

const joinFile = [...data01.data, ...data02.data, ...data03.data, ...data04.data, ...data05.data, ...data06.data, ...data07.data, ...data08.data, ...data09.data]

saveJsonFile(joinFile, 'dataJoin1To9')