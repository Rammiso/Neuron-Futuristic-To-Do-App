import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./Input";
import { Button } from "./Button";
import { useAuthStore } from "../context/authStore";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  X, 
  ArrowLeft,
  CheckCircle2,
  Zap,
  Award,
  Target,
  Edit3,
  Save
} from "lucide-react";

// Avatar options
const avatarStyles = [
  'adventurer',
  'avataaars',
  'big-smile',
  'bottts',
  'croodles',
  'fun-emoji',
  'micah',
  'miniavs',
  'pixel-art'
];

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('avataaars');
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    role: "Student",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        role: user.role || "Student",
        bio: user.bio || "",
      });
      // Extract avatar style from URL if exists
      if (user.avatar) {
        const match = user.avatar.match(/\/(\w+)\/svg/);
        if (match) setSelectedAvatar(match[1]);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarSelect = (style) => {
    setSelectedAvatar(style);
    setShowAvatarPicker(false);
  };

  const handleSave = async () => {
    try {
      await updateUser({
        ...formData,
        avatar: `https://api.dicebear.com/7.x/${selectedAvatar}/svg?seed=${user.email}`
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Profile update error:', error);
      }
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.message || 'Failed to update profile';
      alert('Error: ' + errorMessage);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        role: user.role || "Student",
        bio: user.bio || "",
      });
      if (user.avatar) {
        const match = user.avatar.match(/\/(\w+)\/svg/);
        if (match) setSelectedAvatar(match[1]);
      }
    }
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] overflow-y-auto"
          style={{ margin: 0, padding: 0 }}
        >
          {/* Backdrop with light overlay */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleBackdropClick}
            style={{ margin: 0, padding: 0 }}
          />
          
          {/* Centered Container */}
          <div 
            className="min-h-screen flex items-center justify-center p-4"
            onClick={handleBackdropClick}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-4xl bg-white dark:bg-cyber-darker rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh', overflow: 'hidden' }}
            >
              {/* Header - Sticky */}
              <div className="sticky top-0 z-10 bg-white/95 dark:bg-cyber-darker/95 backdrop-blur-sm border-b border-gray-200 dark:border-cyber-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-cyber-card rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </motion.button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-mono">
                        USER PROFILE
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">
                        SYSTEM ID: {user?.id?.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(90vh - 100px)' }}>
                {/* Profile Header with Avatar */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-neon-green/30 shadow-lg shadow-neon-green/20 relative cursor-pointer"
                        onClick={() => isEditing && setShowAvatarPicker(!showAvatarPicker)}
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/${selectedAvatar}/svg?seed=${user?.email}`}
                          alt="Avatar"
                          className="w-full h-full object-cover bg-gradient-to-br from-neon-dark to-neon-green dark:from-cyber-darker dark:to-cyber-card"
                        />
                        {isEditing && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center"
                          >
                            <Edit3 className="w-8 h-8 text-neon-green" />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    {/* Avatar Picker */}
                    <AnimatePresence>
                      {showAvatarPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="glass rounded-lg p-4 border border-cyber-border"
                        >
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-3 font-mono">
                            SELECT AVATAR STYLE
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {avatarStyles.map((style) => (
                              <motion.button
                                key={style}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAvatarSelect(style)}
                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                  selectedAvatar === style
                                    ? 'border-neon-green shadow-lg shadow-neon-green/50'
                                    : 'border-gray-300 dark:border-cyber-border hover:border-neon-green/50'
                                }`}
                              >
                                <img
                                  src={`https://api.dicebear.com/7.x/${style}/svg?seed=${user?.email}`}
                                  alt={style}
                                  className="w-full h-full object-cover"
                                />
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-3 w-full">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-lg p-3 border border-gray-200 dark:border-cyber-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-neon-green/20 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-neon-green" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-neon-green font-mono">
                              {user?.tasksCompleted || 0}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">COMPLETED</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-lg p-3 border border-gray-200 dark:border-cyber-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Zap className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-amber-400 font-mono">
                              {user?.streak || 0}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">DAY STREAK</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-lg p-3 border border-gray-200 dark:border-cyber-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Award className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-400 font-mono">
                              {user?.level || 1}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">LEVEL</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="flex-1 space-y-4">
                    {/* Name and Email */}
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
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-mono">
                          Email (Read-only)
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 glass rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-cyber-border font-mono opacity-75 cursor-not-allowed bg-gray-50 dark:bg-cyber-card/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone and Location */}
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

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-mono">
                        Role
                      </label>
                      <div className="relative group">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-2.5 glass rounded-lg input-focus text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-cyber-border font-mono bg-white dark:bg-transparent ${
                            !isEditing ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                        >
                          <option value="Student">Student</option>
                          <option value="Professional">Professional</option>
                          <option value="Freelancer">Freelancer</option>
                          <option value="Developer">Developer</option>
                          <option value="Designer">Designer</option>
                          <option value="Manager">Manager</option>
                          <option value="Entrepreneur">Entrepreneur</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-mono">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        className={`w-full px-4 py-2.5 glass rounded-lg input-focus text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none h-24 border border-gray-200 dark:border-cyber-border ${
                          !isEditing ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>

                    {/* Member Since */}
                    <div className="glass rounded-lg p-4 border border-gray-200 dark:border-cyber-border">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-neon-green" />
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">MEMBER SINCE</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                            {user?.joinDate || new Date().toISOString().split('T')[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-cyber-border">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Close
                      </Button>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="flex-1"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        onClick={handleCancel}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal using portal to document.body
  return createPortal(modalContent, document.body);
};
