const fs = require('fs')
const readline = require('readline')
const stream = require('stream')

const descriptionCnae = require('./cnaes')

const saveJsonFile = (data, nomeArquivo) => {
    const obj = {
        data
    }
    const dataJson = JSON.stringify(obj)
    fs.writeFile(`${nomeArquivo}.json`, dataJson, 'utf8', () => console.log('feito'));
}

const stringSituacao = (number) => {
    if(number === '01') return 'NULA'
    if(number === '02') return 'ATIVA'
    if(number === '03') return 'SUSPENSA'
    if(number === '04') return 'INAPTA'
    if(number === '08') return 'BAIXADA'
}

const toDate = (data) => {
    const ano = data.slice(0,4)
    const mes = data.slice(4,6)
    const dia = data.slice(6,8)
    return new Date(ano,mes,dia)
}

var counter = 0
var results = []
const createData = async (contador, contar, fileName,docPath) => {
    const instream = fs.createReadStream(docPath)
    const outstream = new stream()
    const rl = readline.createInterface(instream, outstream)
    const numberPattern = /\d+/g;
    rl.on('line', async function(line) {
        if(line.split(' ')[0] === '1F'){
            const arrayResult = line.split('  ').map((item) => {
                if(item){
                    return item
                }
            }).filter(Boolean)
            const primeirosDados = arrayResult[0].split('1F')[1]
            const cnpj = primeirosDados.slice(0, 15)
            const identificador = primeirosDados.slice(15, 16) === '2' ? 'Filial' : 'Matriz'
            const razao = primeirosDados.slice(16,primeirosDados.length)
            const fantasia = Number(arrayResult[1]) ? '-' : arrayResult[1]
            const segundosDados = arrayResult[1] && arrayResult[1].match( numberPattern ) && arrayResult[1].match( numberPattern ) != null && arrayResult[1].match( numberPattern ).join('') ? arrayResult[1].match( numberPattern ).join('') : (arrayResult[2].match(numberPattern) ? arrayResult[2].match( numberPattern ).join('') : null)
            const filterSegundoDado = segundosDados && segundosDados.length === 12 ? segundosDados : '-'
            const situacaoCadastral = filterSegundoDado === '-' ? '-' : stringSituacao(filterSegundoDado.slice(0,2))
            const dataSituacao = filterSegundoDado === '-' ? '-' : toDate(filterSegundoDado.slice(2,10))
            const codigoMotivo = filterSegundoDado === '-' ? '-' : filterSegundoDado.slice(10,12)
            const terceirosDados = arrayResult.filter(item => item.match(numberPattern) && item.match(numberPattern).join('').length === 19)
            const sliceTerceirosDados = terceirosDados[0] && terceirosDados[0].length >= 19 ? terceirosDados[0].slice(0,19) : '-'
            const cnae = descriptionCnae(sliceTerceirosDados.substr(sliceTerceirosDados.length - 7))
            const definicaoEndereco = terceirosDados[0] && terceirosDados[0].length >= 19 ? terceirosDados[0].slice(19,terceirosDados[0].length) : '-'
            const indexAdress = arrayResult.map((item,index) => {
                if(item.match(numberPattern) && item.match(numberPattern).join('').length === 19) return index
            }).filter(Boolean)[0] + 1
            const adress = `${definicaoEndereco} ${arrayResult[indexAdress] || '-'}, ${arrayResult[indexAdress + 1] || '-'}, ${arrayResult[indexAdress + 2] || '-'}`
            const quartosDados = arrayResult.filter(item => item.match(numberPattern) && item.match(numberPattern).join('').length === 12) ? arrayResult.filter(item => item.match(numberPattern) && item.match(numberPattern).join('').length === 12) : null
            const cep = quartosDados && quartosDados.length >= 2 ? quartosDados[1].trim().slice(0,8) : quartosDados[0].trim().slice(0,8)
            const estado = quartosDados && quartosDados.length >= 2 ? quartosDados[1].trim().slice(8,10) : quartosDados[0].trim().slice(8,10)
            const municipio = quartosDados && quartosDados[1] ? quartosDados.length >= 2 ? quartosDados[1].trim().slice(14,quartosDados[1].length) : quartosDados[0].trim().slice(14,quartosDados[1].length) : '-'
            const codeCnae = sliceTerceirosDados.substr(sliceTerceirosDados.length - 7)
            // const condicionalMunicipios = municipio.includes('BAURU') || municipio.includes('ARACATUBA') || municipio.includes('RIBEIRAO PRETO') || municipio.includes('CIRCUITO DAS AGUAS') 
            const emailDesformatado = arrayResult.filter(param => param.includes('@'))[0]
            const formatedEmail = (emailDesformatado) => {
                if (emailDesformatado) {
                  if (Number(emailDesformatado.slice(0,8))) {
                    return emailDesformatado.slice(8,emailDesformatado.length)
                  }
                  return emailDesformatado;
                }
                return "-";
              }
              const formatedPhone = (emailDesformatado) => {
                if (emailDesformatado) {
                  if (Number(emailDesformatado.slice(0,8))) {
                    return emailDesformatado.slice(0,8)
                  }
                }
                return NaN
              }
              const email = formatedEmail(emailDesformatado)
              const filterDDD = arrayResult.filter(param => param.length === 2 && param !== ' F')[0]
              const ddd = Number(filterDDD) ? filterDDD : NaN
              const telefone1 = formatedPhone(emailDesformatado)
              const telefones = arrayResult.filter(param => param.length === 8 && Number(param))
              const arrayTelefones = telefone1 && telefones ? [...telefones, telefone1] : (telefones[0] ? [...telefones] : null)
            if(situacaoCadastral == 'ATIVA' && (codeCnae == 1412601 || codeCnae == 4642701) ){
                counter++
                const result = {
                    cnpj,
                    identificador,
                    razao,
                    fantasia,
                    situacaoCadastral,
                    dataSituacao,
                    codigoMotivo,
                    cnae:codeCnae,
                    adress,
                    cep:cep || '-',
                    estado:estado || '-',
                    municipio:municipio || '-',
                    email,
                    ddd,
                    arrayTelefones
                }
                console.log(counter)
                results.push(result)
                if(counter === contador){
                    try {
                        if(!contar){
                            saveJsonFile(results,fileName)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
    })
}

const main = async () => {
    // await createData(10000, true, 'data09', '../dataReceita/dados09.csv')
    await createData(8802, false, 'data09', '../dataReceita/dados09.csv')
}

main()