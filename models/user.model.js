import db from '../utils/database.js';
import User from '../schema/usersSchema.js';
import { PERMISSION_ENUM } from '../utils/database.js';
import bcrypt from 'bcrypt';

const SUCCESS_CODE = 0;
const ERROR_CODE = -1;

export default {
    SUCCESS_CODE,
    ERROR_CODE,

    async findById(id) {
        const userRet = await User.findById({ _id: id }).exec();
        // console.log(userRet);
        return userRet;
    },

    async findOrCreateByThirdPartyAcc(idThirdPartyAcc, displayName, email, provider) {
        const userInfo = await this.findById(email);
        if (userInfo === null) {
            const user = new User({
                name: displayName,
                _id: email,
                password: null,
                addr: null,
                provider: provider,
                id_permission: PERMISSION_ENUM.USER
            });
            const newUser = await this.add(user);
            if (newUser === null) {
                return {
                    code: ERROR_CODE,
                    message: 'Đã xảy ra lỗi, vui lòng thử lại sau'
                }
            }
            return {
                code: SUCCESS_CODE,
                data: user,
            }
        }
        else {
            if (userInfo.provider !== provider) {
                return {
                    code: ERROR_CODE,
                    message: `Email được liên kết với tài khoản ${provider} của bạn đã dùng để đăng nhập với một tài khoản đã có trong hệ thống. Vui lòng sử dụng tài khoản khác`,
                }
            }
            return {
                code: SUCCESS_CODE,
                data: userInfo,
            };
        }
    },

    async add(user) {
        try {
            const ret = await user.save();
            return ret;
        }
        catch (err) {
            console.log(err.code);
        }
        return null;
    },

    async register(reqBody) {
        const hashedPwd = bcrypt.hashSync(reqBody.password, 10);;
        const user = new User({
            name: reqBody.fullname,
            _id: reqBody.email,
            password: hashedPwd,
            addr: reqBody.address,
            provider: null,
            id_permission: PERMISSION_ENUM.USER
        });
        return await this.add(user);
    },

    async checkLogin(email, password) {
        const user = await this.findById(email);
        if (user !== null && user.password !== null && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    },
}