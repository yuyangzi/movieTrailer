const mongoose = require('mongoose');
const Movie = mongoose.model('User');

export const checkPassword = async (email, password) => {
    let match = false;
    const user = await user.findOne({ email });

    if (user) match = await user.comparePassword(password, user.password);

    return {
        match,
        user
    };
}

