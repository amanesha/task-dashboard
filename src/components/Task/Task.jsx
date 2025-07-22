import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Task({ task, onStatusChange, onEdit, onDelete }) {
  const [disableDrag, setDisableDrag] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Local editable fields
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statuses = ["Pending", "In Progress", "Completed"];
  const priorities = ["high", "medium", "low"];

  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const statusColors = {
    Pending: "border-yellow-500 dark:border-yellow-400",
    "In Progress": "border-blue-500 dark:border-blue-400",
    Completed: "border-green-500 dark:border-green-400",
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    // call parent onEdit
    onEdit(task.id, editData);
    setShowEditModal(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      {/* TASK CARD */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(!disableDrag ? listeners : {})}
        className={`${
          statusColors[task.status]
        } bg-white rounded-lg shadow-sm p-4 border-l-4 text-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-shadow ${
          disableDrag ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        } hover:bg-gray-750 hover:shadow-md`}
      >
        {/* Title + Priority */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-base">{task.title}</h3>
          <span
            className={`${
              priorityColors[task.priority]
            } text-xs font-semibold px-2.5 py-0.5 rounded-full`}
          >
            {task.priority}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm mb-4">{task.description}</p>

        {/* Status dropdown + Action buttons */}
        <div className="flex justify-between items-start">
          {/* LEFT: Status Dropdown */}
          <div
            className="flex flex-col text-sm"
            onMouseEnter={() => setDisableDrag(true)}
            onMouseLeave={() => setDisableDrag(false)}
          >
            <label className="font-medium mb-1">Status</label>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              className="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* RIGHT: Action buttons */}
          <div
            className="flex flex-row gap-2 max-sm:flex-col"
            onMouseEnter={() => setDisableDrag(true)}
            onMouseLeave={() => setDisableDrag(false)}
          >
            <button
              className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600"
              onClick={() => setShowEditModal(true)}
            >
              Update
            </button>
            <button
              className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          <div>
            <span className="font-medium">Due:</span>{" "}
            {new Date(task.dueDate).toISOString().substring(0, 10)}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(task.createdAt).toISOString().substring(0, 10)}
          </div>
        </div>
      </div>

      {/* ✅ EDIT MODAL */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Task
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-4 text-gray-700 dark:text-gray-300">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => handleEditChange("status", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium">Priority</label>
                <select
                  value={editData.priority}
                  onChange={(e) => handleEditChange("priority", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 mt-6 border-t pt-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Delete
            </h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <strong>{task.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Task;
