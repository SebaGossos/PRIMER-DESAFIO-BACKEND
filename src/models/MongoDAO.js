import mongoose from "mongoose"
//TODO: REVIEW THIS
export default class MongoDAO {
    constructor(config) {
        this.mongoose = mongoose.connect(config.url)
            .catch(error => {
                console.log(error)
                process.exit()
            })
        const timestamp = {
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
        const userSchema = mongoose.Schema(User.schema, timestamp)
        this.models = {
            [User.model]: mongoose.model(User.model, userSchema)
        }
    }
}