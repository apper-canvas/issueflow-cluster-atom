import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Textarea from '@/components/atoms/Textarea';
import { useSelector } from 'react-redux';

const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { user } = useSelector((state) => state.user);

  const handleSave = async () => {
    if (editContent.trim()) {
      await onUpdate(comment.Id, { content: editContent });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const isOwner = user?.userId === comment.createdBy?.Id;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const createdByName = comment.createdBy?.Name || 'Unknown User';

  return (
    <div className="flex gap-3 p-4 border-b border-secondary-200 last:border-b-0">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
          {getInitials(createdByName)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-secondary-900">{createdByName}</span>
            <span className="text-xs text-secondary-500">
              {formatDistanceToNow(new Date(comment.createdOn), { addSuffix: true })}
            </span>
          </div>
          
          {isOwner && !isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-secondary-100 rounded text-secondary-600 hover:text-secondary-900 transition-colors"
                title="Edit comment"
              >
                <ApperIcon name="Edit" size={14} />
              </button>
              <button
                onClick={() => onDelete(comment.Id)}
                className="p-1 hover:bg-red-50 rounded text-secondary-600 hover:text-red-600 transition-colors"
                title="Delete comment"
              >
                <ApperIcon name="Trash2" size={14} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-secondary-700 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;