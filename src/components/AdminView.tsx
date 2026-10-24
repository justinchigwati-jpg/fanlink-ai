import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Users, 
  FileText, 
  DollarSign, 
  Activity,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VerificationRequest, ReportItem, Post } from '../types';
import { INITIAL_VERIFICATIONS, INITIAL_REPORTS } from '../services/dataService';

interface AdminViewProps {
  posts: Post[];
  onDeletePost: (postId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ posts, onDeletePost }) => {
  const { userProfile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'verifications' | 'reports' | 'posts' | 'audit'>('verifications');
  const [verifications, setVerifications] = useState<VerificationRequest[]>(INITIAL_VERIFICATIONS);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [auditLogs, setAuditLogs] = useState<string[]>([
    '2026-10-23 21:14: Admin justinchigwati a approuvé la vérification de Kémi AfroPulse',
    '2026-10-23 20:02: Système anti-fraude: Détection transaction idempotente protégée',
    '2026-10-23 18:30: Admin a supprimé un post signalé pour liens de billetterie frauduleux'
  ]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-100 mb-2">Accès Restreint — Espace Administrateur</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Cette section est protégée par contrôle d'accès ABAC strict et réservée aux administrateurs autorisés (justinchigwati@gmail.com).
        </p>
      </div>
    );
  }

  const handleApproveVerification = (reqId: string) => {
    setVerifications(prev => prev.map(v => {
      if (v.id === reqId) {
        return { ...v, status: 'approved', reviewedAt: new Date().toISOString() };
      }
      return v;
    }));
    setAuditLogs(prev => [`${new Date().toLocaleTimeString()} : Vérification approuvée pour la demande ${reqId}`, ...prev]);
  };

  const handleRejectVerification = (reqId: string) => {
    setVerifications(prev => prev.map(v => {
      if (v.id === reqId) {
        return { ...v, status: 'rejected', reviewedAt: new Date().toISOString() };
      }
      return v;
    }));
    setAuditLogs(prev => [`${new Date().toLocaleTimeString()} : Vérification rejetée pour la demande ${reqId}`, ...prev]);
  };

  const handleResolveReport = (reportId: string, action: 'reviewed' | 'dismissed') => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: action };
      }
      return r;
    }));
    setAuditLogs(prev => [`${new Date().toLocaleTimeString()} : Signalement ${reportId} marqué ${action}`, ...prev]);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 pb-28 pt-4">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-zinc-950 p-5 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Console d'Administration & Modération</h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Connecté en tant que <span className="text-emerald-400 font-mono">{userProfile?.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Demandes Badge</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-black text-zinc-100">
            {verifications.filter(v => v.status === 'pending').length}
          </span>
          <p className="text-[10px] text-zinc-500">En attente d'audit</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Signalements</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-xl font-black text-zinc-100">
            {reports.filter(r => r.status === 'pending').length}
          </span>
          <p className="text-[10px] text-zinc-500">Contenus signalés</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Publications</span>
            <FileText className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-xl font-black text-zinc-100">{posts.length}</span>
          <p className="text-[10px] text-zinc-500">Actives sur le fil</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Sécurité ABAC</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-black text-emerald-400">100%</span>
          <p className="text-[10px] text-zinc-500">Règles déployées</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-zinc-800 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'verifications'
              ? 'bg-emerald-500 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Vérifications ({verifications.filter(v => v.status === 'pending').length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-emerald-500 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Signalements ({reports.filter(r => r.status === 'pending').length})
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'bg-emerald-500 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Modération Publications
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-emerald-500 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Journal d'Audit
        </button>
      </div>

      {/* Tab: Verification Requests */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          {verifications.map(req => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-zinc-100">{req.stageName}</h4>
                  <span className="text-xs text-zinc-400">({req.fullName})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                    req.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mb-1">
                  <span className="text-zinc-500">Catégorie:</span> {req.category} • <span className="text-zinc-500">Pays:</span> {req.country}
                </p>
                <p className="text-xs text-zinc-400 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80 mb-2">
                  <span className="text-zinc-500 font-semibold">Preuves & Liens:</span> {req.socialProof}
                </p>
                <p className="text-[11px] text-zinc-500">
                  Justificatif : {req.documentType} • Déposé le {new Date(req.submittedAt).toLocaleDateString()}
                </p>
              </div>

              {req.status === 'pending' && (
                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => handleRejectVerification(req.id)}
                    className="px-3.5 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4" /> Rejeter
                  </button>
                  <button
                    onClick={() => handleApproveVerification(req.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Valider Badge Officiel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map(rep => (
            <div
              key={rep.id}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-red-400 uppercase">Signalement #{rep.id}</span>
                  <span className="text-xs text-zinc-400">• Cible: {rep.targetType} ({rep.targetId})</span>
                </div>
                <p className="text-xs text-zinc-200 mb-1 font-medium">{rep.reason}</p>
                <p className="text-[11px] text-zinc-500">
                  Signalé par {rep.reporterName} • Statut: {rep.status}
                </p>
              </div>

              {rep.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveReport(rep.id, 'dismissed')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                  >
                    Classer sans suite
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id, 'reviewed')}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-zinc-950 font-bold text-xs"
                  >
                    Appliquer sanction
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Posts Moderation */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {posts.map(post => (
            <div
              key={post.id}
              className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-zinc-100">{post.authorName}</span>
                    <span className="text-[11px] text-zinc-500">@{post.authorUsername}</span>
                  </div>
                  <p className="text-xs text-zinc-300 truncate max-w-md">{post.content}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette publication ?')) {
                    onDeletePost(post.id);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-semibold flex-shrink-0 transition"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5 font-mono text-xs">
          {auditLogs.map((log, index) => (
            <div key={index} className="p-2.5 rounded-lg bg-zinc-900/60 text-zinc-300 border border-zinc-800/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
