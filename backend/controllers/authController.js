import User from '../models/User.js';
import * as tokenService from '../services/tokenService.js';
import { z } from 'zod';

const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { fullName, email, password } = validatedData;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({ fullName, email, password });

        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token required' });
        }

        const decoded = tokenService.verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const newAccessToken = tokenService.generateAccessToken(user);
        const newRefreshToken = tokenService.generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
};
