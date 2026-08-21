import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

const TaskFilters = ({ filters, onChange, onClear }) => {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [prevFilterSearch, setPrevFilterSearch] = useState(filters.search);

  if (filters.search !== prevFilterSearch) {
    setPrevFilterSearch(filters.search);
    setSearchInput(filters.search);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ ...filters, search: searchInput });
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleFieldChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const hasActiveFilters =
    filters.status ||
    filters.priority ||
    filters.search ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="task-filters">
      <div className="task-filters__search">
        <Search className="task-filters__search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="task-filters__search-input"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => handleFieldChange("status", e.target.value)}
        className="task-filters__select"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Completed</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleFieldChange("priority", e.target.value)}
        className="task-filters__select"
      >
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <div className="task-filters__date-group">
        <label className="task-filters__date-label">
          From
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFieldChange("startDate", e.target.value)}
            className="task-filters__date-input"
          />
        </label>
        <label className="task-filters__date-label">
          To
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFieldChange("endDate", e.target.value)}
            className="task-filters__date-input"
          />
        </label>
      </div>

      {hasActiveFilters && (
        <button type="button" className="task-filters__clear" onClick={onClear}>
          <X className="task-filters__clear-icon" />
          Clear filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
