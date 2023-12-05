const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
  Name: { type: String, required: [true, 'Name is required']},
  Topic: { type: String, required: [true, 'Topic is required']},
  Details: { type: String, required: [true, 'Details is required'],minlength: [10, 'Content must be at least 10 characters']},
  Date: { type: String, required: [true, 'Date is required']},
  Start: { type: String, required: [true, 'Start is required']},
  End: { type: String, required: [true, 'End is required']},
  Host: {type: Schema.Types.ObjectId, ref: 'User'},
  Location: { type: String, required: [true, 'Location is required']},
  Image: { type: String, required: [true, 'Image is required']}
});


module.exports = mongoose.model('Connection', connectionSchema);

exports.loop = async () => {
  try {
    // Assuming your model is named 'Connection'
    const categories = await Connection.distinct('Topic').exec();
    categories.sort();
    return categories;
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
};



// exports.loop = () => {const categories = []

//     // Iterate through the connections array using a for loop
//     for (let i = 0; i < connections.length; i++) {
//       const currentConnection = connections[i];
//       const currentTopic = currentConnection.Topic;
    
//       // Check if the current topic is not already in the uniqueConnectionTopics array
//       if (!categories.includes(currentTopic)) {
//         categories.push(currentTopic);
//       }
//     }
//     categories.sort();
//     return categories;};
    
