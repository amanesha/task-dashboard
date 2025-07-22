// Column.jsx
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Task from "./Task";

function Column({ tasks ,onChangeStatus,onEdit,onDelete}) {
  return (
    <div className="bg-gray-100 dark:border-gray-200 dark:bg-gray-500 rounded-lg p-4 max-w-3xl mx-auto">
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="space-y-5  ">
          {tasks.length > 0 ? (
            tasks.map((task) => <Task onDelete={onDelete} onEdit={onEdit} key={task.id} task={task} onStatusChange={onChangeStatus} />)
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-white dark:bg-gray-800 bg-white rounded-lg">
              No tasks found with current filters
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default Column;