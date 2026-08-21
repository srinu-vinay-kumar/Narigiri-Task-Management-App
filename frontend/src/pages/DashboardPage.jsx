import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth, apiStatusConstants } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskFilters from "../components/TaskFilters.jsx";
import Pagination from "../components/Pagination.jsx";

const LIMIT = 10;

const emptyFilters = {
  status: "",
  priority: "",
  search: "",
  startDate: "",
  endDate: "",
};

const DashboardPage = () => {
  const [fetchStatus, setFetchedStatus] = useState(apiStatusConstants.loading);
  const [tasks, setTasks] = useState(null);
  const [meta, setMeta] = useState({ totalTasks: 0, page: 1, lastPage: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);

  const { user } = useAuth();

  useEffect(() => {
    const getTasks = async () => {
      setFetchedStatus(apiStatusConstants.loading);
      try {
        const params = { page, limit: LIMIT };
        if (filters.status) params.status = filters.status;
        if (filters.priority) params.priority = filters.priority;
        if (filters.search) params.search = filters.search;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        const response = await API.get("/tasks", { params });
        setTasks(response.data.data);
        setMeta(response.data.meta);
        setFetchedStatus(apiStatusConstants.success);
      } catch (err) {
        console.error(err.response?.data?.message);
        setFetchedStatus(apiStatusConstants.failure);
      }
    };
    getTasks();
  }, [page, filters, refreshTrigger]);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    setPage(1);
  };

  const handleCreateClick = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this task? This can't be undone.");
    if (!confirmed) return;

    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      triggerRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <main className="dashboard">
      <Navbar />
      <div className="dashboard__hero">
        <h1 className="dashboard__greeting">Welcome {user?.name}</h1>
        <button
          type="button"
          className="dashboard__create-task"
          onClick={handleCreateClick}
        >
          <Plus className="dashboard__create-task-icon" />
          Create Task
        </button>
      </div>

      <div className="dashboard__filters">
        <TaskFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      </div>

      <div className="dashboard__content">
        {fetchStatus === apiStatusConstants.loading && (
          <div className="dashboard__loading">
            <Loader2 className="dashboard__loading-icon" />
            <span>Loading tasks...</span>
          </div>
        )}

        {fetchStatus === apiStatusConstants.failure && (
          <div className="dashboard__error">Couldn't load tasks</div>
        )}

        {fetchStatus === apiStatusConstants.success && (
          <>
            {tasks && tasks.length === 0 ? (
              <p className="dashboard__empty">
                No tasks match your filters. Try adjusting them, or create a new
                task.
              </p>
            ) : (
              <>
                <div className="dashboard__grid">
                  {tasks.map((eachTask) => (
                    <TaskCard
                      key={eachTask._id}
                      task={eachTask}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                <Pagination
                  page={meta.page}
                  lastPage={meta.lastPage}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        )}
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        refreshTasks={triggerRefresh}
        taskToEdit={taskToEdit}
      />
    </main>
  );
};

export default DashboardPage;
