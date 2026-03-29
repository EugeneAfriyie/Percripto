import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets_admin/assets";
import { AppContext } from "../../context/AppContext";
import LoadingScreen from "../../components/LoadingScreen";

const DashBoard = () => {
  const { getDashData, dashData, adminToken, cancelAppointment, dashLoading } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (adminToken) {
      getDashData();
    }
  }, [adminToken]);

  if (dashLoading || !dashData) {
    return <LoadingScreen title="Loading admin dashboard" message="Gathering doctors, patients, and latest booking activity." />;
  }

  const statCards = [
    {
      label: "Doctors",
      value: dashData.doctors,
      icon: assets.doctor_icon,
      accent: "from-sky-500 to-cyan-400",
    },
    {
      label: "Appointments",
      value: dashData.appointments,
      icon: assets.appointment_icon,
      accent: "from-violet-500 to-fuchsia-400",
    },
    {
      label: "Patients",
      value: dashData.patients,
      icon: assets.patients_icon,
      accent: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="rounded-[32px] bg-gradient-to-r from-slate-950 via-sky-900 to-cyan-600 px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-100">Admin Workspace</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Clinic overview at a glance</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-100 sm:text-base">
              Review live booking activity, manage doctors, and keep the care operation moving from one clean control panel.
            </p>
          </div>

          <div className="grid gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur sm:min-w-80">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-100">Today&apos;s Snapshot</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {statCards.map((card) => (
                <div key={card.label} className="rounded-2xl bg-white/10 p-3 text-center">
                  <p className="text-cyan-100">{card.label}</p>
                  <p className="mt-1 text-xl font-semibold">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className={`h-2 w-24 rounded-full bg-gradient-to-r ${card.accent}`} />
                <p className="mt-4 text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <img className="w-12" src={card.icon} alt={card.label} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">Latest bookings</p>
            <p className="text-sm text-slate-500">Recent appointment activity across the platform.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
            {dashData.latestAppointments.length} recent records
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {dashData.latestAppointments.length === 0 && (
            <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">No bookings yet.</div>
          )}

          {dashData.latestAppointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <img className="h-14 w-14 rounded-2xl object-cover" src={item.doctorData.image} alt={item.doctorData.name} />
                <div>
                  <p className="font-semibold text-slate-900">{item.userdata.name}</p>
                  <p className="text-sm text-slate-500">
                    With {item.doctorData.name} on {slotDateFormat(item.slotdate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-600">{item.slotTime}</span>
                {item.cancelled ? (
                  <p className="rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600">Cancelled</p>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
