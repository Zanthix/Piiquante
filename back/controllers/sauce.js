const Sauce = require('../models/sauce');
const fs = require('fs');
const { updateOne, findByIdAndDelete } = require('../models/sauce');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
    .then(() => {res.status(201).json({message: 'Sauce ajoutée !'})})
    .catch(error => {res.status(400).json({error})});
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?{
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    console.log(sauceObject);

    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            console.log(sauce);
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: 'Non-autorisé'})
            }else{
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Sauce modifiée'}))
                .catch(error => res.status(401).json({error}));
            }
        })
        .catch(error => {res.status(400).json({error})});
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({id: req.params.id})
        .then(sauce => {
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: 'Non-autorisé'});
            }else{
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    sauce.deleteOne({_id: req.params.id})
                        .then(() => {res.status(200).json({message: 'Sauce supprimée !'})})
                        .catch(error => res.status(401).json({error}));
                })
            }
        })
        .catch(error => {res.status(500).json({error})});
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.likeSauce = (req, res, next) => {
    if(req.body.userId === undefined || req.body.like === undefined){
        res.status(400).json({message: 'Erreur'});
    }
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            switch(req.body.like){
                case 1:
                    sauce.usersLiked.push(req.body.userId);
                    Sauce.updateOne({_id: req.params.id}, {$inc: {'likes': 1}, $set: {'usersLiked': sauce.usersLiked}})
                    .then(sauce => res.status(200).json({message: 'Avis ajouté !'}))
                    .catch(error => res.status(400).json({error}));  
                    break;
                case -1:
                    sauce.usersDisliked.push(req.body.userId);
                    Sauce.updateOne({_id: req.params.id}, {$inc: {'dislikes': 1}, $set: {'usersDisliked': sauce.usersDisliked}})
                    .then(sauce => res.status(200).json({message: 'Avis ajouté !'}))
                    .catch(error => res.status(400).json({error}));  
                    break;
                case 0:
                    const id = req.body.userId;
                    let index = 0;   
                    for(let item of sauce.usersLiked){
                        if(item === id){
                            sauce.usersLiked.splice(index, 1);
                            Sauce.updateOne({_id: req.params.id}, {$inc: {'likes': -1}, $set:{'usersLiked': sauce.usersLiked}})
                            .then(sauce => res.status(200).json({message: 'Avis retiré !'}))
                            .catch(error => res.status(400).json({error}));
                            break;
                        }
                        index++;
                    }
                    index = 0;
                    for(let item of sauce.usersDisliked){
                        if(item === id){
                            sauce.usersDisliked.splice(index, 1);
                            Sauce.updateOne({_id: req.params.id}, {$inc: {'dislikes': -1}, $set:{'usersDisliked': sauce.usersDisliked}})
                            .then(sauce => res.status(200).json({message: 'Avis retiré !'}))
                            .catch(error => res.status(400).json({error}));
                            break;
                        }
                        index++;
                    }
                    break;
            }
        })
        .catch(error => res.status(404).json({error}));
}