import jwt from 'jsonwebtoken';

const authUser =  async (req, res, next) => {
    try {

        const {token} = req.headers
        console.log(token)
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

       
        req.user = decoded.id;

     

        next();
        
    } catch (error) {
        console.error('Error in authUser:', error);
        return res.status(500).json({ success: false, message: 'invalid token' });
    }

}

export default authUser;
    