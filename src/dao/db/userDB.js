import { userModel } from "../../models/User.js";
import { createHash, isValidPassword } from "../../utilis/utils.js";

export default class UserMongo {
  getByEmail = async (email) =>
    await userModel.findOne({ email }).lean().exec();
  getByEmailForLogin = async ({ email }) => {
    //! HANDLE ERRORS
    const user = await userModel.findOne({ email }).lean().exec();
    if (!user && email !== "adminCoder@coder.com")
      throw `User With Email: ${email} not found`;

    //? SOLUTION
    return user;
  };

  create = async (user) => await userModel.create(user);

  createForRegister = async (user) => {
    //! HANDLE ERRORS
    if (user.password.trim() === "") throw "Must send a valid Password";
    user.password = createHash(user.password);

    const { email } = user;
    const isAnUser = userModel.findOne({ email });

    if (isAnUser) throw `The user with this email: ${email} alredy exist`;

    const tryToCreate = await userModel.create(user);
    if (!tryToCreate) throw `Something was wrong to Upload: ${user}`;

    //? SOLUTION
    return tryToCreate;
  };

  findById = async (id) => {
    const user = await userModel.findById(id);
    return user;
  };

  update = async ( email, data ) => {

    const dataToUpdate = {}
    const isDataToChange = [ 'first_name', 'last_name', 'email', 'age', 'password', 'role' ]

    for( const prop in data ) {
      if(!isDataToChange.includes(prop)) return false; 
      dataToUpdate[prop] = data[prop]
    }

    const updated = await userModel.findOneAndUpdate({email}, dataToUpdate )
    return updated
  }
}
