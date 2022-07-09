import db from '../utils/database.js';
import User from '../schema/usersSchema.js';
import { PERMISSION_ENUM } from '../utils/database.js';

export default {
    async findById(id) {
        const userRet = await User.findById({_id: id}).exec();
        console.log(userRet);
        return userRet;
    },

    async findOrCreateByThirdPartyAcc(idThirdPartyAcc, displayName, email, provider) {
        const userInfo = await this.findById(idThirdPartyAcc + provider);
        if(userInfo === null){
            const user = new User({
                name: displayName,
                _id: email,
                password: null,
                addr: null,
                provider: provider,
                id_permission: PERMISSION_ENUM.USER
            });
            return this.add(user);
        }
        else {
            return userInfo;
        }
    },

    async add(user){
        try{
            const ret = await user.save();
            return ret;
        }
        catch(err) {
            console.log(err.code);
        }
        return null;
    },
}