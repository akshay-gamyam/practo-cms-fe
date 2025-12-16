import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorsList,
  createTopics,
} from "../../../../redux/action/topicAction/TopicAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../routes/RouterConstant";

const CreateTopics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors, isCreateLoading } = useSelector((state) => state.topics);

  const [formData, setFormData] = useState({
    title: "",
    doctorId: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchDoctorsList());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      assignedDoctorId: formData.doctorId,
      description: formData.description,
    };

    try {
      const response = await dispatch(createTopics(payload));
      console.log("response", response);

      if (response?.success === true) {
        toast.success("Topic Created Successfully");
        setFormData({
          title: "",
          doctorId: "",
          description: "",
        });
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create topic", {
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Topics Content
          </h1>
          <p className="text-gray-500 mt-1">
            Add new Topic content to the blog
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Topic Details
          </h2>
          <p className="text-gray-500 mb-6">
            Provide title, description and doctor details
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter content title"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name *
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Doctor</option>
                  {doctors?.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor?.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                placeholder="Write detailed medical content here..."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: "",
                    doctorId: "",
                    description: "",
                  });
                  navigate(ROUTES.DASHBOARD);
                }}
                className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreateLoading}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:shadow-xl disabled:opacity-50"
              >
                {isCreateLoading ? "Publishing..." : "Publish Topic"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTopics;
