"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth";
import { MoveLeftIcon } from "lucide-react";

interface StoreConfig {
  id: string;
  name: string;
  description: string;
  secret_key: string;
  icon: string;
  banner: string;
  background_image: string;
  terminated: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  terminated: boolean;
  verified: boolean;
  avatar_url: string;
  storeId: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  store_config?: StoreConfig;
}

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isTerminated, setIsTerminated] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<
    "terminate" | "reinstate" | null
  >(null);

  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const token = getAccessToken();
    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ADMIN_API}/v1/admin/user?id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch user. Status: ${res.status}`);
        }

        const data = await res.json();
        if (data.message === "success") {
          setUser({
            ...data.data,
            store_config: data.data.store,
          });
          setIsTerminated(data.data.terminated);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleConfirmAction = async () => {
    if (!modalAction || !userId) return;

    const token = getAccessToken();
    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }

    const endpoint =
      modalAction === "terminate"
        ? `${process.env.NEXT_PUBLIC_ADMIN_API}/v1/admin/terminate?id=${userId}`
        : `${process.env.NEXT_PUBLIC_ADMIN_API}/v1/admin/reinstate?id=${userId}`;

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          modalAction === "terminate"
            ? "User terminated successfully."
            : "User has been reinstated."
        );
        setIsTerminated(modalAction === "terminate");
      } else {
        throw new Error(data.message || "Action failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setModalOpen(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <section className="w-full">
      <main className="container mx-auto p-4">
        <div className="w-full flex flex-col gap-6">
          <div className="py-5 w-full flex flex-col gap-3 items-start justify-center">
            <div
              className="flex cursor-pointer hover:bg-green-400 p-2 mb-4 rounded hover:text-black"
              onClick={() => router.push("/users")}
            >
              <MoveLeftIcon /> &nbsp;
              <button>Go Back</button>
            </div>
            <h1 className="text-3xl font-medium text-foreground">
              {user.name} User Details :
            </h1>
          </div>

          <div>
            <p>
              <strong className="text-lg">ID : </strong> {user.id}
            </p>
            <p>
              <strong className="text-lg">Name : </strong> {user.name}
            </p>
            <p>
              <strong className="text-lg">Email : </strong> {user.email}
            </p>
            <p>
              <strong className="text-lg">Terminated : </strong>
              {isTerminated ? "True" : "False"}
            </p>
            <p>
              <strong className="text-lg">Verified : </strong>
              {user.verified ? "True" : "False"}
            </p>
            <p>
              <strong className="text-lg">User Avatar : </strong>
              <img src={user.avatar_url} alt={`${user.name} avatar`} />
            </p>
            <p>
              <strong className="text-lg">Store ID : </strong>
              {user.storeId}
            </p>
            <p>
              <strong className="text-lg">Last Login : </strong>
              {new Date(user.lastLogin).toUTCString()}
            </p>
            <p>
              <strong className="text-lg">Created At : </strong>
              {new Date(user.createdAt).toUTCString()}
            </p>
            <p>
              <strong className="text-lg">Updated At : </strong>
              {new Date(user.updatedAt).toUTCString()}
            </p>

            {user.store_config ? (
              <div>
                <h2 className="text-xl m-5 font-bold">Store Details :</h2>
                <p>
                  <strong className="text-lg">Store Name:</strong>{" "}
                  {user.store_config.name}
                </p>
                <p>
                  <strong className="text-lg">Store Description:</strong>{" "}
                  {user.store_config.description || "No description"}
                </p>
                <p>
                  <strong className="text-lg">Store Terminated:</strong>{" "}
                  {user.store_config.terminated ? "True" : "False"}
                </p>
                <p>
                  <strong className="text-lg">Store Created At:</strong>{" "}
                  {new Date(user.store_config.createdAt).toUTCString()}
                </p>
                <p>
                  <strong className="text-lg">Store Updated At:</strong>{" "}
                  {new Date(user.store_config.updatedAt).toUTCString()}
                </p>
              </div>
            ) : (
              <p>
                <strong className="text-lg">
                  No store configuration available for this user.
                </strong>
              </p>
            )}

            <div className="mt-5 flex gap-4">
              <button
                onClick={() => {
                  setModalAction("terminate");
                  setModalOpen(true);
                }}
                className={`p-2.5 border-none rounded ${
                  isTerminated ? "bg-gray-500" : "bg-red-600 text-white"
                }`}
              >
                Terminate User
              </button>

              <button
                onClick={() => {
                  setModalAction("reinstate");
                  setModalOpen(true);
                }}
                className={`p-2.5 border-none rounded ${
                  isTerminated ? "bg-green-600 text-white" : "bg-gray-500"
                }`}
              >
                Reinstate User
              </button>
            </div>

            {message && <p className="text-green-500 mt-2">{message}</p>}
            {error && <p className="text-red-500 mt-2">Error: {error}</p>}
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">
              {modalAction === "terminate"
                ? "Confirm Termination"
                : "Confirm Reinstatement"}
            </h2>
            <p className="mt-2">
              Are you sure you want to{" "}
              <span className="font-bold text-red-600">{modalAction}</span> this
              user?
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfilePage;
