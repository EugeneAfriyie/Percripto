import jwt from 'jsonwebtoken';

const authAdminMiddleware =  async (req, res, next) => {
    try {

        const {admintoken} = req.headers
        console.log(admintoken)
        if (!admintoken) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(admintoken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: 'Forbidden: Not an admin' });
        }

        next();
        
    } catch (error) {
        console.error('Error in authAdminMiddleware:', error);
        return res.status(500).json({ success: false, message: 'invalid token' });
    }

}

export default authAdminMiddleware;
    