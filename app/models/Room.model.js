const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
	location: {
		type: String,
		required: true
	},
	features: {
		type: Array
	},
	status: {
		type: Boolean,
		default: true
	},
	persons: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	userid: {
		type: String,
		required: true
	},
	photos: [
		{
			contentType: String,
			image: Buffer
		}
	]
})

module.exports = mongoose.model("Room", roomSchema)
