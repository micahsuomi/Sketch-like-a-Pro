const mongoose = require('mongoose');
const Gallery = require('./models/gallery');
const Comment = require('./models/comment');

const data = [
    {
        name: 'Still Painting',
        image: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        description: 'Oil on canvas'
    },
    {
        name: 'Still Life',
        image: 'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        description: 'Oil on canvas'
    },
    {
        name: 'Abstract #2',
        image: 'https://images.pexels.com/photos/1012982/pexels-photo-1012982.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        description: 'Acrylic on canvas'
    },

    {
        name: 'Abstract #3',
        image: 'https://images.pexels.com/photos/889839/pexels-photo-889839.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        description: 'Acrylic on paper'
    },
]

const seedDataBase = () => {
    Gallery.deleteMany({}, (err) => {
        if(err) return status(404).send('Not Found');
        console.log('Removed gallery')
        /*
        data.forEach((seed) => {
            Gallery.create(seed, (err, gallery) => {
                if(err) {
                    console.log(err)
                } else {
                    Comment.create({text: 'Great artwork', author: 'Brad Pitt'}, (err, comment) => {
                        if(err) {
                            console.log(err)
                        } else {
                            gallery.comments.push(comment)
                            gallery.save()
                        }
                    })
                }
            })
        })*/
    })
    
}

module.exports = seedDataBase;