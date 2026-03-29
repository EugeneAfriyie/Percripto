import jwt from 'jsonwebtoken';

const authAdminMiddleware =  async (req, res, next) => {
    try {

        const {admintoken} = req.headers
        console.log(admintoken)
        if (!admintoken) {
            return res.status(401).json({ success: false, message: 'No admintoken provided' });
        }
        const decoded = jwt.verify(admintoken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid admintoken' });
        }

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: 'Forbidden: Not an admin' });
        }

        req.adminEmail = decoded.email;
        next();
        
    } catch (error) {
        console.error('Error in authAdminMiddleware:', error);
        if (error.name === 'admintokenExpiredError') {
            return res.status(401).json({ success: false, message: 'admintoken expired. Please log in again.' });
        }
        return res.status(401).json({ success: false, message: 'Authentication failed: Invalid admintoken.' });
    }

}

export default authAdminMiddleware;
    
