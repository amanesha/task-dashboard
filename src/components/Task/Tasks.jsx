import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState, useMemo, useEffect } from "react";
import Column from "./Column";
import ExportJson from "./ExporJson";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved
      ? JSON.parse(saved) // parse the stored string back into an array
      : [ ];
  });

 useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // convert array → string
  }, [tasks]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [prioritySort, setPrioritySort] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  // ✅ Error state for inputs
  const [formErrors, setFormErrors] = useState({});

  const getTaskPos = (id) => tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((prev) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      return arrayMove(prev, originalPos, newPos);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const onEdit = (taskId, newData) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...newData } : task))
    );
  };

  const onDelete = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // ✅ Add New Task with simple validation
  const handleAddTask = () => {
    let errors = {};
    if (!newTaskData.title.trim()) errors.title = "Title is required.";
    if (!newTaskData.description.trim())
      errors.description = "Description is required.";
    if (!newTaskData.dueDate) errors.dueDate = "Due date is required.";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return; // Stop if errors

    const newTask = {
      id: Date.now().toString(),
      title: newTaskData.title,
      description: newTaskData.description,
      status: "Pending",
      priority: newTaskData.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date(newTaskData.dueDate),
    };

    setTasks((prev) => [newTask, ...prev]);

    setShowAddModal(false);

    setNewTaskData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });
    setFormErrors({});
  };

  // ✅ Filter + Sort + Search
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (statusFilter !== "All") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (prioritySort !== "All") {
      filtered = filtered.filter((task) => task.priority === prioritySort);
    }

    return filtered;
  }, [tasks, statusFilter, prioritySort, searchTerm]);

  const clearFilters = () => {
    setStatusFilter("All");
    setPrioritySort("All");
    setSearchTerm("");
  };

  return (
    <div className="p-6 dark:bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Task Board
      </h1>

      {/* ✅ FILTERS */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={prioritySort}
          onChange={(e) => setPrioritySort(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded w-60 dark:bg-gray-700 dark:text-white"
        />

        <button
          onClick={clearFilters}
          className="px-3 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
        >
          Clear Filters
        </button>

        <div className="flex flex-wrap gap-3 mb-1 items-center">
          <ExportJson data={tasks} />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <svg
            className="w-5 h-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-7 7V5"
            />
          </svg>
          Add Task
        </button>
      </div>

      {/* ✅ Drag & Drop Context */}
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <Column
          onDelete={onDelete}
          tasks={filteredTasks}
          onChangeStatus={onStatusChange}
          onEdit={onEdit}
        />
      </DndContext>

      {/* ✅ ADD TASK MODAL */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Task
            </h2>

            {/* Title */}
            <div className="mb-3">
              <label className="block text-sm font-medium dark:text-white">
                Title
              </label>
              <input
                type="text"
                value={newTaskData.title}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, title: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              {formErrors.title && (
                <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-sm font-medium dark:text-white">
                Description
              </label>
              <textarea
                rows={3}
                value={newTaskData.description}
                onChange={(e) =>
                  setNewTaskData({
                    ...newTaskData,
                    description: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              {formErrors.description && (
                <p className="text-red-400 text-xs mt-1">
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="mb-3">
              <label className="block text-sm font-medium dark:text-white">
                Priority
              </label>
              <select
                value={newTaskData.priority}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, priority: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="mb-3">
              <label className="block text-sm font-medium dark:text-white">
                Due Date
              </label>
              <input
                type="date"
                value={newTaskData.dueDate}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, dueDate: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              {formErrors.dueDate && (
                <p className="text-red-400 text-xs mt-1">
                  {formErrors.dueDate}
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
