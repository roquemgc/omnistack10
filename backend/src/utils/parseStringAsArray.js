module.exports = function parseStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(tech => tech.trim());
    //Split para dividir os valores entre as ',' em um array
    //trim ignora espaçamento antes e depois das strings     
}