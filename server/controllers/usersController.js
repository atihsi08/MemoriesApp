import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from '../models/usersModel.js';

export const usersController = {
    signin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email });

            if (!user) return res.status(404).json({ message: 'User does not exist' });

            const match = await bcrypt.compare(password, user.password);

            if (!match) return res.status(400).json({ message: 'Invalid Credentials!!' });

            const token = jwt.sign({ email: user.email, id: user._id }, process.env.TOKEN, { expiresIn: '1h' });
            res.status(200).json({ result: user, token: token });
        } catch (error) {
            res.status(500).json({ message: 'Something Went Wrong...' });
        }
    },

    signup: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            const user = await Users.findOne({ email });

            if (user) return res.status(400).json({ message: 'User already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await Users.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
            const token = jwt.sign({ email: result.email, id: result._id }, process.env.TOKEN, { expiresIn: '1h' });
            res.status(201).json({ result, token });
        } catch (error) {
            res.status(500).json({ message: 'Something Went Wrong...' });
        }
    },
}