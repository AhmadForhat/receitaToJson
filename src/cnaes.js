const interval = (str,inic,fim) => {
    const number = Number(str)
    if(number >= inic && number <= fim) return true
    return false
}

const cnaes = (cnae) => {
    const firstTwo = cnae.slice(0,2)
    if(interval(firstTwo,1,3)) return 'AGRICULTURA, PECUÁRIA, PRODUÇÃO FLORESTAL, PESCA E AQÜICULTURA'
    if(interval(firstTwo,05,09)) return 'INDÚSTRIAS EXTRATIVAS'
    if(interval(firstTwo,10,33)) return 'INDÚSTRIAS DE TRANSFORMAÇÃO'
    if(interval(firstTwo,35,35)) return 'ELETRICIDADE E GÁS'
    if(interval(firstTwo,36,39)) return 'ÁGUA, ESGOTO, ATIVIDADES DE GESTÃO DE RESÍDUOS E DESCONTAMINAÇÃO'
    if(interval(firstTwo,41,43)) return 'CONSTRUÇÃO'
    if(interval(firstTwo,45,47)) return 'COMÉRCIO; REPARAÇÃO DE VEÍCULOS AUTOMOTORES E MOTOCICLETAS'
    if(interval(firstTwo,49,53)) return 'TRANSPORTE, ARMAZENAGEM E CORREIO'
    if(interval(firstTwo,55,56)) return 'ALOJAMENTO E ALIMENTAÇÃO'
    if(interval(firstTwo,58,63)) return 'INFORMAÇÃO E COMUNICAÇÃO'
    if(interval(firstTwo,64,66)) return 'ATIVIDADES FINANCEIRAS, DE SEGUROS E SERVIÇOS RELACIONADOS'
    if(interval(firstTwo,68,68)) return 'ATIVIDADES IMOBILIÁRIAS'
    if(interval(firstTwo,69,75)) return 'ATIVIDADES PROFISSIONAIS, CIENTÍFICAS E TÉCNICAS'
    if(interval(firstTwo,77,82)) return 'ATIVIDADES ADMINISTRATIVAS E SERVIÇOS COMPLEMENTARES'
    if(interval(firstTwo,84,84)) return 'ADMINISTRAÇÃO PÚBLICA, DEFESA E SEGURIDADE SOCIAL'
    if(interval(firstTwo,85, 85)) return 'EDUCAÇÃO'
    if(interval(firstTwo,86,88)) return 'SAÚDE HUMANA E SERVIÇOS SOCIAIS'
    if(interval(firstTwo,90,93)) return 'ARTES, CULTURA, ESPORTE E RECREAÇÃO'
    if(interval(firstTwo,94,96)) return 'OUTRAS ATIVIDADES DE SERVIÇOS'
    if(interval(firstTwo,97,97)) return 'SERVIÇOS DOMÉSTICOS'
    if(interval(firstTwo,99,99)) return 'ORGANISMOS INTERNACIONAIS E OUTRAS INSTITUIÇÕES EXTRATERRITORIAIS'
    return '-'
}

module.exports = cnaes