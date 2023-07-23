const mongoose =  require('mongoose');

const ImageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: [true, "Enter image"],
    },
    imageName: {
        type: String,
        required: [true, "Enter image name"],
    }
})

module.exports = mongoose.model('Image', ImageSchema);
