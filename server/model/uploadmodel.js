import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model using ES6 export syntax
const Image = mongoose.model('Image', uploadSchema);
export default Image;
