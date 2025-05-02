// src/components/ManageJoinRequests.tsx
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
    const url = `/companyJoinRequests/${requestId}/approve`;
    approveMutation.mutate(
      {}, // Empty body
      {
        onSuccess: () => {
          setMessage({ text: "Request approved successfully!", type: "success" });
          refetch(); // Refresh the list
        },
        onError: (error: any) => {
          setMessage({ text: `Failed to approve: ${error.message}`, type: "error" });
        }
      }
    );
  };

  const handleReject = (requestId: string) => {
    const url = `/companyJoinRequests/${requestId}/reject`;
    rejectMutation.mutate(
      {}, // Empty body
      {
        onSuccess: () => {
          setMessage({ text: "Request rejected successfully!", type: "success" });
          refetch(); // Refresh the list
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

  if (isLoading) return <div>Loading join requests...</div>;
  if (error) return <div>Error loading requests: {error.message}</div>;

  return (
    <div className="join-requests-container">
      <h2>Pending Join Requests</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {!data?.requests?.length ? (
        <p>No pending requests found.</p>
      ) : (
        <div className="requests-list">
          {data.requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="recruiter-info">
                <h3>{request.recruiter.username}</h3>
                <p>{request.recruiter.email}</p>
                <p className="date">Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="action-buttons">
                <button
                  onClick={() => handleApprove(request._id)}
                  disabled={approveMutation.isLoading}
                  className="approve-button"
                >
                  {approveMutation.isLoading ? "Processing..." : "Approve"}
                </button>

                <button
                  onClick={() => handleReject(request._id)}
                  disabled={rejectMutation.isLoading}
                  className="reject-button"
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
