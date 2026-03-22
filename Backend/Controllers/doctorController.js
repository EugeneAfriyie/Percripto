import doctorModel from "../model/doctorModel.js"

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const updatedDoc = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }
    );

    res.json({
      success: true,
      message: `Availability Changed to ${updatedDoc.available}`,
      doctor: updatedDoc
    });

  } catch (error) {
    console.log('Error updating doctor availability:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    console.log("Doctors List Fetched Successfully", doctors);


    res.json({
      success:true,
      doctors,
      message: 'Doctors List Fetched Successfully'
    })
    
  } catch (error) {
    console.log('Error fetching doctor list:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}

export { changeAvailability,doctorList }