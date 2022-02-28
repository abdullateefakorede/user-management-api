const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

class AuthService {
	static generateToken(data) {
		return jwt.sign(data, config.secret, { expiresIn: '10h' });
	}

	static decodeToken(token) {
		return jwt.verify(token, config.secret);
	}

	static async hashPassword(password, saltRound) {
		const salt = await bcrypt.genSalt(saltRound);
		return await bcrypt.hash(password, salt);
	}
}

module.exports = AuthService;