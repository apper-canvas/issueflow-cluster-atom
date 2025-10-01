import { useState, useEffect } from 'react';
import commentService from '@/services/api/commentService';
import CommentItem from '@/components/molecules/CommentItem';
import CommentForm from '@/components/organisms/CommentForm';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';

const CommentList = ({ issueId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await commentService.getByIssueId(issueId);
      setComments(data || []);
    } catch (err) {
      setError(err.message);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (issueId) {
      loadComments();
    }
  }, [issueId]);

  const handleCommentAdded = async (commentData) => {
    const newComment = await commentService.create(commentData);
    if (newComment) {
      await loadComments();
      return true;
    }
    return false;
  };

  const handleCommentUpdate = async (commentId, updates) => {
    const updated = await commentService.update(commentId, updates);
    if (updated) {
      await loadComments();
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const success = await commentService.delete(commentId);
      if (success) {
        await loadComments();
      }
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p>Error loading comments: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <div className="bg-secondary-50 p-4 rounded-lg">
        <CommentForm issueId={issueId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* Comments List */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ApperIcon name="MessageSquare" size={18} className="text-secondary-600" />
          <h3 className="font-semibold text-secondary-900">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
        </div>

        {comments.length === 0 ? (
          <Empty
            icon="MessageSquare"
            title="No comments yet"
            description="Be the first to comment on this issue"
          />
        ) : (
          <div className="border border-secondary-200 rounded-lg bg-white divide-y divide-secondary-200">
            {comments.map((comment) => (
              <CommentItem
                key={comment.Id}
                comment={comment}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;