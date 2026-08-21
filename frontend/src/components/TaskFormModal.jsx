import { useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";

import API from "../services/api";

Modal.setAppElement("#root");

const taskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).default("PENDING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  location: z.string().optional(),
  file: z.any().optional(),
});

const emptyDefaults = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
  location: "",
};

const TaskFormModal = ({
  isOpen,
  onRequestClose,
  refreshTasks,
  taskToEdit,
}) => {
  const isEditMode = Boolean(taskToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      reset({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        status: taskToEdit.status || "PENDING",
        priority: taskToEdit.priority || "MEDIUM",
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 10) : "",
        location: taskToEdit.location || "",
      });
    } else {
      reset(emptyDefaults);
    }
  }, [isOpen, taskToEdit, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("status", data.status);
      formData.append("priority", data.priority);
      if (data.description) formData.append("description", data.description);
      if (data.dueDate) formData.append("dueDate", data.dueDate);
      if (data.location) formData.append("location", data.location);
      if (data.file?.length > 0) formData.append("file", data.file[0]);

      if (isEditMode) {
        const response = await API.put(`/tasks/${taskToEdit._id}`, formData);
        toast.success(
          response.data.emailSent
            ? "Task updated — completion email sent!"
            : "Task updated",
        );
      } else {
        const response = await API.post("/tasks", formData);
        if (response.data.emailSent) {
          toast.success("Task created — confirmation email sent!");
        } else {
          toast("Task created, but the confirmation email couldn't be sent.", {
            icon: "⚠️",
          });
        }
      }

      refreshTasks();
      onRequestClose();
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} task:`,
        error,
      );
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} task`,
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="task-modal"
      overlayClassName="task-modal__overlay"
    >
      <div className="task-modal__header">
        <h2>{isEditMode ? "Edit task" : "Create new task"}</h2>
        <button
          type="button"
          className="task-modal__close"
          onClick={onRequestClose}
          aria-label="Close"
        >
          <X className="task-modal__close-icon" />
        </button>
      </div>

      <form className="task-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="task-form__group">
          <label>Title</label>
          <input
            type="text"
            {...register("title")}
            className="task-form__input"
          />
          {errors.title && (
            <span className="task-form__error">{errors.title.message}</span>
          )}
        </div>

        <div className="task-form__group">
          <label>Description</label>
          <textarea
            {...register("description")}
            className="task-form__textarea"
            rows={3}
          />
        </div>

        <div className="task-form__row">
          <div className="task-form__group">
            <label>Status</label>
            <select {...register("status")} className="task-form__select">
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Completed</option>
            </select>
          </div>
          <div className="task-form__group">
            <label>Priority</label>
            <select {...register("priority")} className="task-form__select">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div className="task-form__row">
          <div className="task-form__group">
            <label>Due Date</label>
            <input
              type="date"
              {...register("dueDate")}
              className="task-form__input"
            />
          </div>
          <div className="task-form__group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Hyderabad"
              {...register("location")}
              className="task-form__input"
            />
          </div>
        </div>

        <div className="task-form__group">
          <label className="task-form__file-label">
            <Upload className="task-form__file-icon" />
            <span>
              {isEditMode
                ? "Replace attachment (optional)"
                : "Attachment (Image)"}
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("file")}
            className="task-form__input"
          />
        </div>

        <div className="task-form__actions">
          <button type="button" onClick={onRequestClose}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update task"
                : "Save task"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
