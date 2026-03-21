import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddDoc = () => {
  const [docImg,setDocImg] = useState(false)
  const [name,setName] = useState('')
  const [email,setemail] = useState('')
  const [password,setpassword] = useState('')
  const [experience,setexperience] = useState('1 Year')
  const [fee,setfee] = useState('')
  const [about,setabout] = useState('')
  const [speciality,setspeciality] = useState('General Physician')
  const [degree,setdegree] = useState('')
  const [address_1,setaddress_1] = useState('')
  const [address_2,setaddress_2] = useState('')
  
  const { adminToken, backendUrl } = useContext(AdminContext)
  console.log(adminToken)
  

const onSubmit = async (e)=>{
  e.preventDefault()

  try {
    if (!docImg) {
      return toast.error("Image Not Selected");
    }

    const formData = new FormData();
    formData.append("image", docImg);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("experience", experience);
    formData.append("fee", Number(fee));
    formData.append("about", about);
    formData.append("speciality", speciality);
    formData.append("degree", degree);
    formData.append("address", JSON.stringify({ line1: address_1, line2: address_2 }));

    formData.forEach((item)=>{
      console.log(item)
    })

    const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
      headers: { adminToken: adminToken } 
    });

    if (data.success) {
      toast.success(data.message || "Doctor Added Successfully");
      setDocImg(false);
      setName('');
      setpassword('');
      setemail('');
      setaddress_1('');
      setaddress_2('');
      setdegree('');
      setabout('');
      setfee('');
    } else {
      toast.error(data.message || "Failed to add doctor");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "An error occurred");
  }
}

  return (
    <form onSubmit={onSubmit} className="m-5 w-full" action="">
      <p className="mb-3 text-lg font-medium">ADD DOCTOR</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll ">
        <div className="flex items-center gap-4 mb-8 text-gray-500 ">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer  "
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input onChange={(e)=> setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>
            Upload Doctor <br /> Picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4 ">

            <div className=" flex-1 flex flex-col gap-1">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Enter Doctor Name"
                className="border rounded px-1 py-2 "
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setemail(e.target.value)}
                value={email}
                type="text"
                placeholder="Enter Doctor Email"
                className="border rounded px-1 py-2"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setpassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter Doctor Password"
                className="border rounded px-1 py-2"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select onChange={(e) => setexperience(e.target.value)} value={experience} name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fee</p>
              <input onChange={(e) => setfee(e.target.value)} value={fee} className="border rounded px-1 py-2" type="number" placeholder="Enter Doc Fee" />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>

              <select onChange={(e) => setspeciality(e.target.value)} value={speciality} className="border rounded px-1 py-2" name="" id="">
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>

              <div className="flex-1 flex flex-col gap-1">
                <p>Education</p>
                <input onChange={(e) => setdegree(e.target.value)} value={degree} className="border rounded px-1 py-2" type="text" placeholder="Enter Doc Education" required />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Address</p>
                <input
                onChange={(e) => setaddress_1(e.target.value)}
                value={address_1}
                className="border rounded px-1 py-2"
                  type="text"
                  placeholder="Address 1"
                  name=""
                  id=""
                  required
                />
                <input
                onChange={(e) => setaddress_2(e.target.value)}
                value={address_2}
                className="border rounded px-1 py-2"
                  type="text"
                  placeholder="Address 2"
                  name=""
                  id=""
                  required
                />
              </div>
            </div>
          </div> 
        </div>
        <div className="">
          <p className="mt-4 mb-2">About</p>
          <textarea onChange={(e) => setabout(e.target.value)} value={about} className="w-full px-4 pt-2 border rounded  " placeholder="Write Doc About" required rows={5} />
        </div>

        <button className="bg-primary mt4 px-10 py-3 text-white rounded-full ">Add Doctor</button>
      </div>
    </form>
  );
};

export default AddDoc;
