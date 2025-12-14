import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};

// Validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createTask: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).allow(''),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    tags: Joi.array().items(Joi.string())
  }),

  updateTask: Joi.object({
    title: Joi.string().min(1).max(200),
    description: Joi.string().max(1000).allow(''),
    dueDate: Joi.date(),
    priority: Joi.string().valid('low', 'medium', 'high'),
    completed: Joi.boolean(),
    tags: Joi.array().items(Joi.string())
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    phone: Joi.string().allow(''),
    location: Joi.string().allow(''),
    role: Joi.string().allow(''),
    bio: Joi.string().allow(''),
    avatar: Joi.string().uri().allow('')
  }),

  updateSettings: Joi.object({
    theme: Joi.object({
      isDark: Joi.boolean()
    }),
    aiEnabled: Joi.boolean(),
    notifications: Joi.object({
      email: Joi.boolean(),
      push: Joi.boolean(),
      taskReminders: Joi.boolean()
    }),
    preferences: Joi.object({
      defaultPriority: Joi.string().valid('low', 'medium', 'high'),
      defaultView: Joi.string().valid('list', 'calendar', 'kanban')
    })
  })
};
