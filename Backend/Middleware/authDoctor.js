import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  try {
    const { doctortoken } = req.headers;

    if (!doctortoken) {
      return res.status(401).json({ success: false, message: 'No doctor token provided' });
    }

    const decoded = jwt.verify(doctortoken, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid or malformed doctor token' });
    }

    req.doctorId = decoded.id;
    next();
  } catch (error) {
    console.error('Error in authDoctor:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Doctor session expired. Please log in again.' });
    }

    return res.status(401).json({ success: false, message: 'Authentication failed: Invalid doctor token.' });
  }
};

export default authDoctor;
