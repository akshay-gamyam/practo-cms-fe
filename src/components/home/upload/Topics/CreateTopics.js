import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorsList,
  createTopics,
  fetchUplodedTopcsList,
} from "../../../../redux/action/topicAction/TopicAction";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../../routes/RouterConstant";
import { createDoctorPointers } from "../../../../redux/action/doctorAction/DoctorAction";
import { ROLE_VARIABLES_MAP } from "../../../../utils/helper";

const CreateTopics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: topicId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { doctors, topics, isCreateLoading } = useSelector(
    (state) => state.topics
  );
  console.log("topics", topics);

  const selectedTopic = topics?.find((topic) => topic?.id === topicId);

  const doctorFirstName = selectedTopic?.assignedDoctor?.firstName;
  const doctorLastName = selectedTopic?.assignedDoctor?.lastName;
  const selectedDoctorId = selectedTopic?.assignedDoctor?.id;

  const isDoctorCreator = user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR;
  const isMedicalReviewerCreator =
    user?.role === ROLE_VARIABLES_MAP?.MEDICAL_REVIEWER;

  const [formData, setFormData] = useState({
    title: "",
    doctorId: "",
    description: "",
  });

  useEffect(() => {
    if (isMedicalReviewerCreator && selectedDoctorId) {
      setFormData((prev) => ({
        ...prev,
        doctorId: selectedDoctorId,
      }));
    }
  }, [isMedicalReviewerCreator, selectedDoctorId]);

  useEffect(() => {
    dispatch(fetchUplodedTopcsList());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === ROLE_VARIABLES_MAP?.MEDICAL_REVIEWER) {
      dispatch(fetchDoctorsList());
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      doctorId: "",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isDoctorCreator) {
        response = await dispatch(
          createDoctorPointers({
            topicId,
            notes: formData.description,
          })
        );
        console.log("reposning ", response);
      } else {
        response = await dispatch(
          createTopics({
            title: formData.title,
            assignedDoctorId: formData.doctorId,
            description: formData.description,
          })
        );
      }

      if (response?.success) {
        toast.success("Created Successfully" || response.message);
        const routingTopic = isDoctorCreator ? ROUTES.MY_TOPICS : ROUTES.MEDICAL_TOPICS
        resetForm();
        navigate(routingTopic);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create", {
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
            {isDoctorCreator ? "Add Doctor Notes" : "Create Topic"}
          </h1>
          <p className="text-gray-500 mt-1">
            Add new Topic content to the blog
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {isDoctorCreator ? "Add Doctor Notes" : "Topic Details"}
          </h2>
          <p className="text-gray-500 mb-6">
            Provide title, description and doctor details
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              {!isDoctorCreator && (
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
                    {isMedicalReviewerCreator ? (
                      <input
                        type="text"
                        value={`${doctorFirstName} ${doctorLastName}`}
                        disabled
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                    ) : (
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
                    )}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  placeholder={
                    isDoctorCreator
                      ? "Write doctor notes..."
                      : "Write detailed medical content..."
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
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
                  navigate(ROUTES.MY_TOPICS);
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
