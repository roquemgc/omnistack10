const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    //Index para buscar um dev específico
    async index(request, response){
        const { latitude, longitude, techs } = request.query;

        const techsArray = parseStringAsArray(techs);
        
        const devs = await Dev.find({
            techs: {
                $in: techsArray,
                //$in, operator do MongoDB para encontrar objetos dentro de techsArray
            }, 
            location: {
                /* $near, operator do MongoDB para encontrar objetos perto do 'Point' e uma
                distância máxima de 10000 metros */
                $near: {
                    $geometry:{
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                },
            },
        });
        return response.json({ devs });
    }
}