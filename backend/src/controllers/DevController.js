const axios = require('axios');
const Dev = require('../models/Dev');
//axios faz a chamada para outras API's
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage  } = require('../websocket')

module.exports = {

    //Index retorna todos os Devs
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    //Store armazena um Dev na base de dados
    async store(request, response){
        //async = indica que a response pode demorar
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });
        
        if(!dev){

            const apiResponse = await axios.get(`htpps://api.github.com/users/${github_username}`);
            //await = aguardar a resposta de axios.get para proseguir
            const { name = login, avatar_url, bio } = apiResponse.data;
            //(name = login) caso name não exista, recebe o valor de login

            const techsArray = parseStringAsArray(techs);
            //Função para converter uma string em array
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                name,
                github_username,
                avatar_url,
                bio,
                techs: techsArray,
                location
            }); 

            /* Filtrar conexões que estão há no máximo 10KM de distáncia e que o DEV
            tenha pelo menos uma das tecnologias filtradas */

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'newDev', Dev);
        }
    
        return response.json(dev);
    }
}