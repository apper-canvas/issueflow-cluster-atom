import { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import Textarea from '@/components/atoms/Textarea';
import ApperIcon from '@/components/ApperIcon';

const CommentForm = ({ issueId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    setIsSubmitting(true);

    const commentData = {
      issueId: issueId,
      content: content.trim(),
      createdBy: user?.userId,
      createdOn: new Date().toISOString()
    };

    const success = await onCommentAdded(commentData);
    
    if (success) {
      setContent('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        disabled={isSubmitting}
        className="w-full resize-none"
      />
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-500">
          {content.length} / 5000 characters
        </span>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setContent('')}
            disabled={!content || isSubmitting}
          >
            Clear
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                <span className="ml-2">Posting...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Send" size={16} />
                <span className="ml-2">Post Comment</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;