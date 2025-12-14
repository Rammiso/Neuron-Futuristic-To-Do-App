import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks
} from '../controllers/taskController.js';
import { protect } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validation.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getTasks)
  .post(validate(schemas.createTask), createTask);

router.patch('/bulk', bulkUpdateTasks);

router.route('/:id')
  .get(getTask)
  .put(validate(schemas.updateTask), updateTask)
  .delete(deleteTask);

export default router;
