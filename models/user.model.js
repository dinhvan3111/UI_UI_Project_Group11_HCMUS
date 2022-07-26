import db from '../utils/database.js';
import User from '../schema/usersSchema.js';
import { PERMISSION_ENUM } from '../utils/database.js';
import bcrypt from 'bcrypt';

export default {
    async findById(id) {
        const userRet = await User.findById({_id: id}).exec();
        // console.log(userRet);
        return userRet;
    },

    async findOrCreateByThirdPartyAcc(idThirdPartyAcc, displayName, email, provider) {
        const userInfo = await this.findById(email);
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

    async register(reqBody) {
        const hashedPwd = bcrypt.hashSync(reqBody.password, 10);;
        const user = new User({
            name: reqBody.fullname,
            _id: reqBody.username,
            password: hashedPwd,
            addr: reqBody.address,
            provider: null,
            id_permission: PERMISSION_ENUM.USER
        });
        return await this.add(user);
    },
}