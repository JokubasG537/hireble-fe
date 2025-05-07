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

  const {
    data,
    isLoading,
    error,
    refetch
  } = useApiQuery<RequestsResponse>(
    ["joinRequests", companyId],
    `/companyJoinRequests/company/${companyId}?status=pending`
  );

  const approveMutation = useApiMutation(
    "/companyJoinRequests/:id/approve",
    "PATCH",
    ["joinRequests", companyId]
  );

  const rejectMutation = useApiMutation(
    "/companyJoinRequests/:id/reject",
    "PATCH",
    ["joinRequests", companyId]
  );

  const handleApprove = (requestId: string) => {
    approveMutation.mutate(
      {
        __params: { id: requestId },
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
        __params: { id: requestId }
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

  if (isLoading) return <div>Loading join requests...</div>;
  if (error) return <div>Error loading requests: {(error as Error).message}</div>;

  return (
    <div>
      <h2>Pending Join Requests</h2>

      {message && (
        <div>
          {message.text}
        </div>
      )}

      {!data?.requests?.length ? (
        <div>
          No pending requests found.
        </div>
      ) : (
        <div>
          {data.requests.map((request) => (
            <div key={request._id}>
              <h3>{request.recruiter.username}</h3>
              <p>{request.recruiter.email}</p>
              <p>
                Requested on: {new Date(request.createdAt).toLocaleDateString()}
              </p>
              <div>
                <button
                  onClick={() => handleApprove(request._id)}
                  disabled={approveMutation.isLoading}
                >
                  {approveMutation.isLoading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={rejectMutation.isLoading}
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