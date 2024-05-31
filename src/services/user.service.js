import * as bcrypt from 'bcrypt';
import { userModel } from '../models/user.model.js';


export class UserService {
  async getAll(res) {
    try {
      const users = await userModel.find();
      res.json({ users });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Hubo un error al obtener los usuarios' });
  }
  }
  
  async createUser(req, res) {
    const {email, password, role} = req.body
    try {
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      const findUser = await userModel.findOne({email});
      if (findUser) {
        return res.json({message: "user existent"});
      }
      console.log({password, email, role});
      const salt = 10;
      const hash = await bcrypt.hash(password, salt);

      const user = await userModel.create({
        email,
        role,
        createdAt: new Date(),
        password: hash
      })
      return res.json({user});
    } catch (error) {
      return res.status(400).json({message: "User not found"})
    }
  };

}
