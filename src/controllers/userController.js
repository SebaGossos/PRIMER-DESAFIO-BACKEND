import UserDTO from "../dto/user.dto.js";
import { UserService } from "../repositories/index.js";



import fs from "fs";

function wasCreated(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (err) {
    return false;
  }
}

export default class UserController {
  getAll = async (req, res) => {
    try {
      const users = await UserService.getAll();
      const userFilter = []
      for ( const user of users ) {
        const userDto = new UserDTO(user)
        userFilter.push( userDto.getImportant() )
      }
      res.send({ status: "success", payload: userFilter });
    } catch (error) {
      res.send({ status: "error", message: error });
    }
  };

  premium = async (req, res) => {
    const uid = req.params.uid;

    const documents = [];

    for (const file in req.files) {
      const path = "./" + req.files[file][0]?.path.replace(/\\/g, "/");
      const { fieldname } = req.files[file][0];
      documents.push({ name: fieldname + "-" + uid, reference: path });
      if (wasCreated(path) === false) {
        return res.send({
          status: "error",
          message: `didn´t found the file ${path}`,
        });
      }
    }

    const user = await UserService.findById(uid);

    if (user.role === "premium") {
      await UserService.update(uid, { role: "user" });
      return res.send({ status: "success", payload: "your role is user now" });
    }

    await UserService.update(uid, { role: "premium", documents });

    return res.send({
      status: "success",
      payload: "filesUploaded succesfully",
    });
  };

  profilePicture = async (req, res) => {
    const userId = req.user?._id;
    const rootFile = req.file?.filename;

    try {
      await UserService.update(userId, { profile_picture: rootFile });
      res.send({ status: "success" });
    } catch (error) {
      console.log(error);
      res.send({ status: "error", message: "cant update User information" });
    }
  };
}
