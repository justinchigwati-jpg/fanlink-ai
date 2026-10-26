import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Lock, 
  Hash, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';
import { getApiUrl } from '../services/apiConfig';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const { userProfile } = useAuth();
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isExclusive, setIsExclusive] = useState(false);
  const [exclusivePriceCoins, setExclusivePriceCoins] = useState(50);
  
  // AI Assistant states
  const [isAILoading, setIsAILoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('La taille maximale du fichier est de 15 Mo.');
      return;
    }

    setMediaFile(file);
    const isVid = file.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = () => {
      setMediaUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setErrorMessage(null);
  };

  const callAIAssistant = async (action: 'caption' | 'hashtags') => {
    setIsAILoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(getApiUrl('/api/ai/creator-assistant'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt: content || 'Nouvelle exclusivité pour la communauté FanLink',
          niche: userProfile?.accountType || 'Général',
          tone: 'dynamique et inspirant'
        })
      });

      const data = await response.json();
      if (data.success && data.output) {
        if (action === 'caption') {
          setContent(data.output);
        } else if (action === 'hashtags') {
          const hashtagsOnly = data.output.match(/#[a-zA-Z0-9_]+/g)?.join(' ') || data.output;
          setTagsInput(prev => (prev ? `${prev} ${hashtagsOnly}` : hashtagsOnly));
        }
      } else {
        setErrorMessage(data.error || 'Impossible de contacter l\'assistant IA pour le moment.');
      }
    } catch {
      setErrorMessage('Erreur réseau lors de l\'appel à FanLink AI.');
    } finally {
      setIsAILoading(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) {
      setErrorMessage('Veuillez ajouter un message ou un média avant de publier.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    let finalMediaUrl = mediaUrl;

    // If media is a newly picked local data URL, upload to persistent server storage
    if (mediaUrl && mediaUrl.startsWith('data:')) {
      try {
        const uploadRes = await fetch(getApiUrl('/api/upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataBase64: mediaUrl,
            filename: mediaFile?.name || 'media',
            mimeType: mediaFile?.type || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg')
          })
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          finalMediaUrl = uploadData.url;
        }
      } catch (uploadErr) {
        console.warn('Upload fallback to direct preview:', uploadErr);
      }
    }

    const tags = tagsInput
      .split(/[\s,]+/)
      .map(t => t.replace(/^#/, '').trim())
      .filter(Boolean);

    const newPost: Post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorId: userProfile?.id || 'demo_fan_101',
      authorName: userProfile?.displayName || 'Membre FanLink',
      authorUsername: userProfile?.username || 'user',
      authorAvatar: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      authorBadge: userProfile?.badge || 'none',
      authorVerified: userProfile?.isVerified || false,
      content: content.trim(),
      mediaType,
      mediaUrl: finalMediaUrl || undefined,
      tags: tags.length > 0 ? tags : ['FanLink'],
      likesCount: 0,
      commentsCount: 0,
      isExclusive,
      exclusivePriceCoins: isExclusive ? exclusivePriceCoins : undefined,
      createdAt: new Date().toISOString(),
      likedByCurrentUser: false
    };

    setIsUploading(false);
    onPostCreated(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#0A100D] border border-[#183A2A] p-5 sm:p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#183A2A] mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-white">Créer une publication</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] text-xs font-bold border border-[#00E676]/30">
              FanLink Connect
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#A8B5AE] hover:text-white hover:bg-[#183A2A]/40">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* User Preview */}
          <div className="flex items-center gap-3">
            <img
              src={userProfile?.avatarUrl}
              alt={userProfile?.displayName}
              className="w-10 h-10 rounded-full object-cover border border-[#00E676]/40"
            />
            <div>
              <p className="text-xs font-bold text-white">{userProfile?.displayName}</p>
              <p className="text-[11px] text-[#A8B5AE]">@{userProfile?.username}</p>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez une vidéo, une photo, des coulisses ou une annonce..."
              maxLength={1000}
              className="w-full p-3.5 rounded-2xl bg-[#030604] border border-[#183A2A] text-xs sm:text-sm text-white placeholder-[#A8B5AE]/60 focus:outline-none focus:border-[#00E676] leading-relaxed"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-[#A8B5AE] font-mono">
              {content.length}/1000
            </span>
          </div>

          {/* AI Assistance Toolbar */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#031A0F] to-[#0A100D] border border-[#183A2A]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#00E676] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00E676] animate-pulse" />
                Assistant FanLink AI
              </span>
              {isAILoading && <Loader2 className="w-3.5 h-3.5 text-[#00E676] animate-spin" />}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isAILoading}
                onClick={() => callAIAssistant('caption')}
                className="px-3 py-1.5 rounded-xl bg-[#0A100D] hover:bg-[#183A2A] text-white border border-[#183A2A] text-xs font-medium transition flex items-center gap-1"
              >
                ✨ Générer légende
              </button>
              <button
                type="button"
                disabled={isAILoading}
                onClick={() => callAIAssistant('hashtags')}
                className="px-3 py-1.5 rounded-xl bg-[#0A100D] hover:bg-[#183A2A] text-white border border-[#183A2A] text-xs font-medium transition flex items-center gap-1"
              >
                #️⃣ Hashtags viraux
              </button>
            </div>
          </div>

          {/* Media File Picker & Preview */}
          <div>
            <label className="block text-xs font-semibold text-[#A8B5AE] mb-1.5">
              Médias (Photo ou Vidéo)
            </label>
            
            {mediaUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#183A2A] bg-black max-h-56">
                {mediaType === 'video' ? (
                  <video src={mediaUrl} controls className="w-full max-h-56 object-cover" />
                ) : (
                  <img src={mediaUrl} alt="Aperçu" className="w-full max-h-56 object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaUrl('');
                    setMediaFile(null);
                    setMediaType('none');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-white hover:bg-red-500 transition"
                  title="Supprimer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#183A2A] hover:border-[#00E676]/60 bg-[#030604]/60 cursor-pointer transition">
                <div className="flex items-center gap-3 text-[#A8B5AE] mb-2">
                  <ImageIcon className="w-6 h-6 text-[#00E676]" />
                  <Video className="w-6 h-6 text-[#00B86B]" />
                </div>
                <p className="text-xs text-white font-semibold mb-1">
                  Importer une photo ou une vidéo
                </p>
                <p className="text-[10px] text-[#A8B5AE]">
                  PNG, JPG, MP4 jusqu'à 15 Mo
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Hashtags Input */}
          <div>
            <label className="block text-xs font-semibold text-[#A8B5AE] mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-[#00E676]" /> Hashtags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ex: FanLink Stars Musique Live"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white placeholder-[#A8B5AE]/60 focus:outline-none focus:border-[#00E676]"
            />
          </div>

          {/* Exclusive Content Toggle */}
          <div className="p-3.5 rounded-2xl bg-[#030604] border border-[#183A2A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Contenu Exclusif Payant</p>
                <p className="text-[11px] text-[#A8B5AE]">Accessible uniquement contre des FanCoins</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isExclusive}
                onChange={(e) => setIsExclusive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#0A100D] border border-[#183A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#183A2A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#183A2A] text-xs font-semibold text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#34FF96] text-black font-black text-xs shadow-lg shadow-[#00E676]/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <span>Publier maintenant</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
