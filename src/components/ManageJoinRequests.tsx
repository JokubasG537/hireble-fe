import React, { useState, useContext, useEffect } from "react";
import { useApiQuery, useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";

interface JoinRequest {
  _id: string;
  recruiter: {
    _id: string;
    username: string;
    email: string;
  };
  company: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface RequestsResponse {
  requests: JoinRequest[];
}

export default function ManageJoinRequests({ companyId }: { companyId: string }) {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch pending requests for this company
  const {
    data,
    isLoading,
    error,
    refetch
  } = useApiQuery<RequestsResponse>(
    ["joinRequests", companyId],
    `/companyJoinRequests/company/${companyId}?status=pending`
  );

  // Approve request mutation
  const approveMutation = useApiMutation(
    "/companyJoinRequests/:id/approve",
    "PATCH",
    ["joinRequests", companyId]
  );

  // Reject request mutation
  const rejectMutation = useApiMutation(
    "/companyJoinRequests/:id/reject",
    "PATCH",
    ["joinRequests", companyId]
  );

  const handleApprove = (requestId: string) => {
    approveMutation.mutate(
      {
        __params: { id: requestId },
        // You can add other body data here if needed
      },
      {
        onSuccess: () => {
          setMessage({ text: "Request approved successfully!", type: "success" });
          refetch();
        },
        onError: (error: any) => {
          setMessage({ text: `Failed to approve: ${error.message}`, type: "error" });
        }
      }
    );
  };


  const handleReject = (requestId: string) => {
    rejectMutation.mutate(
      {
        __params: { id: requestId } // Change to match the :id in URL
      },
      {
        onSuccess: () => {
          setMessage({ text: "Request rejected successfully!", type: "success" });
          refetch();
        },
        onError: (error: any) => {
          setMessage({ text: `Failed to reject: ${error.message}`, type: "error" });
        }
      }
    );
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (isLoading) return <div style={{ padding: '16px', textAlign: 'center' }}>Loading join requests...</div>;
  if (error) return <div style={{ padding: '16px', color: 'red' }}>Error loading requests: {(error as Error).message}</div>;

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Pending Join Requests</h2>

      {message && (
        <div style={{
          padding: '8px 16px',
          marginBottom: '16px',
          backgroundColor: message.type === 'success' ? '#e6f7e6' : '#f8d7da',
          color: message.type === 'success' ? '#2e7d32' : '#721c24',
          borderRadius: '4px'
        }}>
          {message.text}
        </div>
      )}

      {!data?.requests?.length ? (
        <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
          No pending requests found.
        </div>
      ) : (
        <div>
          {data.requests.map((request) => (
            <div key={request._id} style={{
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{request.recruiter.username}</h3>
              <p style={{ marginBottom: '8px', color: '#555' }}>{request.recruiter.email}</p>
              <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: '#777' }}>
                Requested on: {new Date(request.createdAt).toLocaleDateString()}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleApprove(request._id)}
                  disabled={approveMutation.isLoading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    opacity: approveMutation.isLoading ? 0.7 : 1
                  }}
                >
                  {approveMutation.isLoading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={rejectMutation.isLoading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    opacity: rejectMutation.isLoading ? 0.7 : 1
                  }}
                >
                  {rejectMutation.isLoading ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
