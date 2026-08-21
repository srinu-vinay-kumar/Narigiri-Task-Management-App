import { Calendar, MapPin, Paperclip, Pencil, Trash2 } from "lucide-react";
import WeatherBadge from "./WeatherBadge.jsx";

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <article className="task-card">
      <header className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span
          className={`task-card__priority task-card__priority--${task.priority?.toLowerCase()}`}
        >
          {task.priority}
        </span>
      </header>

      <div className="task-card__body">
        <p className="task-card__description">{task.description}</p>

        <div className="task-card__meta">
          {task.dueDate && (
            <span className="task-card__date">
              <Calendar className="task-card__meta-icon" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.location && (
            <span className="task-card__location">
              <MapPin className="task-card__meta-icon" />
              {task.location}
            </span>
          )}
          <WeatherBadge location={task.location} />
        </div>

        {task.fileUrl && (
          <a
            href={task.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="task-card__attachment"
          >
            <Paperclip className="task-card__meta-icon" />
            <span>Attachment</span>
          </a>
        )}
      </div>

      <footer className="task-card__footer">
        <span
          className={`task-card__status task-card__status--${task.status?.toLowerCase()}`}
        >
          {task.status}
        </span>
        <div className="task-card__actions">
          <button
            className="task-card__btn task-card__btn--edit"
            aria-label="Edit task"
            onClick={() => onEdit(task)}
          >
            <Pencil className="task-card__btn-icon" />
          </button>
          <button
            className="task-card__btn task-card__btn--delete"
            aria-label="Delete task"
            onClick={() => onDelete(task._id)}
          >
            <Trash2 className="task-card__btn-icon" />
          </button>
        </div>
      </footer>
    </article>
  );
};

export default TaskCard;
