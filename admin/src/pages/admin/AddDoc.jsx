import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddDoc = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [experience, setexperience] = useState("1 Year");
  const [fee, setfee] = useState("");
  const [about, setabout] = useState("");
  const [speciality, setspeciality] = useState("General Physician");
  const [degree, setdegree] = useState("");
  const [address_1, setaddress_1] = useState("");
  const [address_2, setaddress_2] = useState("");

  const { adminToken, backendUrl } = useContext(AdminContext);

  const onSubmit = async (e) => {
    e.preventDefault();

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

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { adminToken: adminToken },
      });

      if (data.success) {
        toast.success(data.message || "Doctor Added Successfully");
        setDocImg(false);
        setName("");
        setpassword("");
        setemail("");
        setaddress_1("");
        setaddress_2("");
        setdegree("");
        setabout("");
        setfee("");
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const previewImage = docImg ? URL.createObjectURL(docImg) : assets.upload_area;

  return (
    <form onSubmit={onSubmit} className="w-full p-4 sm:p-6 lg:p-8">
      <div className="rounded-[32px] bg-gradient-to-r from-slate-950 via-indigo-900 to-blue-700 px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-100">Doctor Onboarding</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Add a new doctor profile</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-100 sm:text-base">
              Create a polished doctor account with profile image, speciality, education, and booking details in one flow.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8 flex items-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-gray-500">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img className="h-20 w-20 rounded-3xl bg-white object-cover" src={previewImage} alt="" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <div>
            <p className="font-medium text-slate-900">Upload doctor photo</p>
            <p className="mt-1 text-sm text-slate-500">Use a clear headshot for a more trusted patient-facing profile.</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 text-gray-600">
          <label className="grid gap-2 text-sm">
            Name
            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Enter doctor name" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" required />
          </label>

          <label className="grid gap-2 text-sm">
            Doctor Email
            <input onChange={(e) => setemail(e.target.value)} value={email} type="email" placeholder="Enter doctor email" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
          </label>

          <label className="grid gap-2 text-sm">
            Doctor Password
            <input onChange={(e) => setpassword(e.target.value)} value={password} type="password" placeholder="Enter doctor password" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
          </label>

          <label className="grid gap-2 text-sm">
            Experience
            <select onChange={(e) => setexperience(e.target.value)} value={experience} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
              <option value="1 Year">1 Year</option>
              <option value="2 Year">2 Year</option>
              <option value="3 Year">3 Year</option>
              <option value="4 Year">4 Year</option>
              <option value="5 Year">5 Year</option>
              <option value="6 Year">6 Year</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            Fee
            <input onChange={(e) => setfee(e.target.value)} value={fee} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" type="number" placeholder="Enter consultation fee" />
          </label>

          <label className="grid gap-2 text-sm">
            Speciality
            <select onChange={(e) => setspeciality(e.target.value)} value={speciality} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm lg:col-span-2">
            Education
            <input onChange={(e) => setdegree(e.target.value)} value={degree} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" type="text" placeholder="Enter doctor education" required />
          </label>

          <label className="grid gap-2 text-sm">
            Address Line 1
            <input onChange={(e) => setaddress_1(e.target.value)} value={address_1} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" type="text" placeholder="Address line 1" required />
          </label>

          <label className="grid gap-2 text-sm">
            Address Line 2
            <input onChange={(e) => setaddress_2(e.target.value)} value={address_2} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" type="text" placeholder="Address line 2" required />
          </label>

          <label className="grid gap-2 text-sm lg:col-span-2">
            About
            <textarea onChange={(e) => setabout(e.target.value)} value={about} className="w-full rounded-2xl border border-slate-200 px-4 pt-3 outline-none focus:border-primary" placeholder="Write a short doctor bio" required rows={5} />
          </label>
        </div>

        <button className="mt-8 rounded-full bg-primary px-10 py-3 text-white">Add Doctor</button>
      </div>
    </form>
  );
};

export default AddDoc;
