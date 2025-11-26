import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fetchPendingPlayers = async () => {
  const { data } = await API.get('/admin/players/pending');
  return data.pending || [];
};

const fetchPendingTransfers = async () => {
  const { data } = await API.get('/admin/transfers/pending');
  return data.pending || [];
};

export default function Approvals(): JSX.Element {
  const qc = useQueryClient();

  const { data: players = [], isLoading: playersLoading } = useQuery({ queryKey: ['admin', 'players', 'pending'], queryFn: fetchPendingPlayers });
  const { data: transfers = [], isLoading: transfersLoading } = useQuery({ queryKey: ['admin', 'transfers', 'pending'], queryFn: fetchPendingTransfers });

  // accept object: { id, note, force }
  const approvePlayer = useMutation({
    mutationFn: ({ id, note, force }: { id: string; note?: string; force?: boolean }) =>
      API.post(`/admin/players/${id}/approve`, { note, force }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'players', 'pending'] }),
  });

  const rejectPlayer = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => API.post(`/admin/players/${id}/reject`, { note }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'players', 'pending'] }),
  });

  const approveTransfer = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => API.post(`/admin/transfers/${id}/approve`, { note }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'transfers', 'pending'] }),
  });

  const rejectTransfer = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => API.post(`/admin/transfers/${id}/reject`, { note }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'transfers', 'pending'] }),
  });

  // selected player details
  const [selectedPlayer, setSelectedPlayer] = React.useState<any>(null);
  const [detailsLoading, setDetailsLoading] = React.useState(false);
  const [approvalNote, setApprovalNote] = React.useState('');
  const [forceApprove, setForceApprove] = React.useState(false);

  const openPlayerDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      const { data } = await API.get(`/admin/players/${id}`);
      // controller returns { ok: true, player }
      setSelectedPlayer(data.player || data);
    } catch (err) {
      console.error('Failed to load player details', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedPlayer(null);
    setApprovalNote('');
    setForceApprove(false);
  };

  const isMinor = (dob?: string) => {
    if (!dob) return false;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return false;
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) < 18;
  };

  const requiredDocsForFifa = (player: any) => {
    // basic FIFA/TMS-like requirements
    const base = ['passport', 'avatar', 'medicalCertificate', 'birthCertificate', 'certificate'];
    // parentalConsent required if minor
    if (isMinor(player?.dateOfBirth)) base.push('parentalConsent');
    // ITC may be required for international transfers, show it if exists
    return Array.from(new Set(base));
  };

  const checkDocs = (player: any) => {
    const docs = player?.documents || {};
    const required = requiredDocsForFifa(player);
    const result: Record<string, boolean> = {};
    for (const key of required) {
      const d = docs[key];
      result[key] = !!(d && (d.path || d.url || d.filename));
    }
    return { required, result };
  };

  const docCheck = selectedPlayer ? checkDocs(selectedPlayer) : { required: [], result: {} };
  const allDocsPresent = docCheck.required.length > 0 && docCheck.required.every((k) => !!docCheck.result[k]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Approvals Queue</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Player Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {playersLoading ? (
              <p>Loading players...</p>
            ) : players.length === 0 ? (
              <p>No pending player registrations</p>
            ) : (
              <div className="space-y-3">
                {players.map((p: any) => (
                  <div key={p._id} className="p-3 border rounded flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-muted-foreground">Club: {p.clubId?.name || p.clubId?.email || '—'}</div>
                      <div className="text-sm text-muted-foreground">NRC: {p.nrc}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => openPlayerDetails(p._id)}>View</Button>
                      <Button size="sm" onClick={() => approvePlayer.mutate({ id: p._id })} disabled={approvePlayer.isLoading}>Approve</Button>
                      <Button variant="destructive" size="sm" onClick={() => rejectPlayer.mutate({ id: p._id })} disabled={rejectPlayer.isLoading}>Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            {transfersLoading ? (
              <p>Loading transfers...</p>
            ) : transfers.length === 0 ? (
              <p>No pending transfer requests</p>
            ) : (
              <div className="space-y-3">
                {transfers.map((t: any) => (
                  <div key={t._id} className="p-3 border rounded flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{t.player?.name || t.player}</div>
                      <div className="text-sm text-muted-foreground">From: {t.fromClub?.name || '—'}</div>
                      <div className="text-sm text-muted-foreground">To: {t.toClub?.name || '—'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => approveTransfer.mutate({ id: t._id })} disabled={approveTransfer.isLoading}>Approve</Button>
                      <Button variant="destructive" size="sm" onClick={() => rejectTransfer.mutate({ id: t._id })} disabled={rejectTransfer.isLoading}>Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="ml-auto w-full max-w-2xl bg-white shadow-lg h-full overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedPlayer.name}</h2>
                <div className="text-sm text-muted-foreground">DOB: {selectedPlayer.dateOfBirth || '—'}</div>
                <div className="text-sm text-muted-foreground">Club: {selectedPlayer.clubId?.name || selectedPlayer.clubId?.email || '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={closeDetails}>Close</Button>
              </div>
            </div>

            <section className="mb-4">
              <h3 className="font-semibold mb-2">FIFA / TMS Checklist</h3>
              <div className="space-y-2">
                {docCheck.required.map((key) => (
                  <div key={key} className="flex items-center justify-between p-2 border rounded">
                    <div className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className={docCheck.result[key] ? 'text-green-600' : 'text-red-600'}>
                      {docCheck.result[key] ? 'Present' : 'Missing'}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h3 className="font-semibold mb-2">Uploaded Documents</h3>
              <div className="space-y-2">
                {Object.entries(selectedPlayer.documents || {}).map(([k, d]: any) => (
                  <div key={k} className="flex items-center justify-between p-2 border rounded">
                    <div className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="flex items-center gap-2">
                      {d && (d.path || d.url || d.secureUrl) ? (
                        <a className="text-blue-600 underline" target="_blank" rel="noreferrer" href={d.path || d.url || d.secureUrl}>
                          View
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                      <span className="text-sm text-muted-foreground">{d?.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="cursor-pointer" checked={forceApprove} onChange={(e) => setForceApprove(e.target.checked)} />
                <span className="text-sm">Force approve (bypass missing documents)</span>
              </label>
            </section>

            <section className="mb-4">
              <label className="block mb-2">Note</label>
              <textarea className="w-full p-2 border rounded" value={approvalNote} onChange={(e) => setApprovalNote(e.target.value)} rows={3} />
            </section>

            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  if (!selectedPlayer) return;
                  if (!allDocsPresent && !forceApprove) {
                    // require admin to check force
                    alert('Required documents are missing. Enable "Force approve" to bypass.');
                    return;
                  }
                  try {
                    await approvePlayer.mutateAsync({ id: selectedPlayer._id, note: approvalNote, force: forceApprove });
                    closeDetails();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                disabled={approvePlayer.isLoading}
              >
                Approve
              </Button>

              <Button
                variant="destructive"
                onClick={async () => {
                  if (!selectedPlayer) return;
                  try {
                    await rejectPlayer.mutateAsync({ id: selectedPlayer._id, note: approvalNote });
                    closeDetails();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                disabled={rejectPlayer.isLoading}
              >
                Reject
              </Button>

              <div className="text-sm text-muted-foreground">{allDocsPresent ? 'All required documents present' : 'Missing required documents'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
