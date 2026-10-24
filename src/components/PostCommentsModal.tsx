import React, { useState } from 'react';
import { X, Send, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Comment, Post } from '../types';
import { useAuth } from '../context/AuthContext';

interface PostCommentsModalProps {
  post: Post | null;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
  comments: Comment[];
}

export const PostCommentsModal: React.FC<PostCommentsModalProps> = ({
  post,
  onClose,
  onAddComment,
  comments
}) => {
  const { userProfile } = useAuth();
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0A100D] border border-[#183A2A] rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl text-white overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#183A2A]">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-white">Commentaires</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#183A2A] text-[#00E676]">
              {comments.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#A8B5AE] hover:text-white hover:bg-[#183A2A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Post Summary Bar */}
        <div className="px-5 py-3 bg-[#030604] border-b border-[#183A2A] flex items-center gap-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-8 h-8 rounded-full object-cover border border-[#00E676]/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-semibold truncate">{post.authorName}</p>
            <p className="text-xs text-[#A8B5AE] line-clamp-1">{post.content}</p>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-[#A8B5AE] text-xs">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#00E676]" />
              Soyez le premier à réagir à cette publication !
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2.5 text-xs">
                <img
                  src={c.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={c.authorName}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 bg-[#030604] p-2.5 rounded-2xl border border-[#183A2A]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#00E676]">{c.authorName}</span>
                    <span className="text-[10px] text-[#A8B5AE]">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-[#A8B5AE] leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#030604] border-t border-[#183A2A] flex items-center gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Écrire un commentaire..."
            className="flex-1 px-4 py-2 text-xs bg-[#0A100D] border border-[#183A2A] rounded-full text-white placeholder-[#A8B5AE]/60 focus:outline-none focus:border-[#00E676]"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2.5 rounded-full bg-[#00E676] text-[#030604] font-bold hover:bg-[#00B86B] disabled:opacity-40 transition active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
