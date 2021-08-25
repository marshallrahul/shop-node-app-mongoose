const { MongoClient } = require("mongodb");

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect("mongodb+srv://max:DkaTJsqp7EcsxVCc@cluster0.xz9dy.mongodb.net/shop-node?retryWrites=true&w=majority", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.then((client) => {
			console.log("Connected");
			_db = client.db();
			callback();
		})
		.catch((err) => {
			console.log(err);
			throw err;
		})
}

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw "No database found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;