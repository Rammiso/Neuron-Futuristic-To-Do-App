import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";
import { useAuthStore } from "../context/authStore";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Camera } from "lucide-react";

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    role: user?.role || "Student",
    bio: user?.bio || "",
    joinDate: user?.joinDate || new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      role: user?.role || "Student",
      bio: user?.bio || "",
      joinDate: user?.joinDate || new Date().toISOString().split("T")[0],
    });
    setIsEditing(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="USER PROFILE" size="xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200 dark:border-cyber-border">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-dark to-neon-green dark:from-neon-green dark:to-neon-lime flex items-center justify-center shadow-neon-green">
              <User className="w-12 h-12 text-white" />
            </div>
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 p-2 bg-neon-dark dark:bg-neon-green rounded-full shadow-lg"
              >
                <Camera className="w-4 h-4 text-white dark:text-cyber-darker" />
              </motion.button>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-mono">
              {formData.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">
              {formData.role}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              disabled={!isEditing}
              className={!isEditing ? "opacity-75" : ""}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              disabled={!isEditing}
              className={!isEditing ? "opacity-75" : ""}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
              disabled={!isEditing}
              placeholder="+1 (555) 000-0000"
              className={!isEditing ? "opacity-75" : ""}
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              icon={MapPin}
              disabled={!isEditing}
              placeholder="City, Country"
              className={!isEditing ? "opacity-75" : ""}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <div className="relative group">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-2.5 glass rounded-lg input-focus text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-cyber-border font-medium bg-white dark:bg-transparent ${
                    !isEditing ? "opacity-75" : ""
                  }`}
                >
                  <option value="Student">Student</option>
                  <option value="Professional">Professional</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <Input
              label="Member Since"
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleChange}
              icon={Calendar}
              disabled={!isEditing}
              className={!isEditing ? "opacity-75" : ""}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              className={`w-full px-4 py-2.5 glass rounded-lg input-focus text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none h-24 border border-gray-200 dark:border-cyber-border ${
                !isEditing ? "opacity-75" : ""
              }`}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-cyber-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-dark dark:text-neon-green font-mono">
              {user?.tasksCompleted || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">
              COMPLETED
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-dark dark:text-neon-green font-mono">
              {user?.streak || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">
              DAY STREAK
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-dark dark:text-neon-green font-mono">
              {user?.level || 1}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">
              LEVEL
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {!isEditing ? (
            <>
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
