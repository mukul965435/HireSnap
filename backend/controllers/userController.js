import User from '../models/User.js';

export const updateProfile = async (req, res, next) => {
    try {
        const { fullName, bio } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.fullName = fullName || user.fullName;
        user.bio = bio || user.bio;
        
        if (req.file) {
            user.avatar = `/uploads/avatars/${req.file.filename}`;
        }

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio
            }
        });
    } catch (error) {
        next(error);
    }
};
