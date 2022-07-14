import {ObjectId, getNewObjectId, toObjectId} from '../utils/database.js';
import env from '../utils/env.js';
import Category from '../schema/categoriesSchema.js';

export default {
    async findById(id) {
        return await Category.findById({_id: id}).exec();
    },

    async save(category){
        try{
            const ret = await category.save();
            return ret;
        }
        catch(err) {
            console.log(err.code);
        }
        return null;
    },

    async getAll(){
        return await Category.find({}).exec();

    },
}