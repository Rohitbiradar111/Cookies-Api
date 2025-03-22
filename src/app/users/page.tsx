"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAccessToken } from "@/utils/auth";

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
}

interface ApiResponse {
  message: string;
  data: User[];
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [verified, setVerified] = useState<string>("all");
  const [terminated, setTerminated] = useState<string>("all");

  const fetchUsers = async () => {
    const token = getAccessToken();
    console.log("Access Token:", token);

    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_API}/v1/admin/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: ApiResponse = await response.json();
      console.log("Users Data:", data);

      if (data.message === "success") {
        setUsers(data.data);
        setFilteredUsers(data.data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (search.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (verified !== "all") {
      const isVerified = verified === "true";
      filtered = filtered.filter((user) => user.verified === isVerified);
    }

    if (terminated !== "all") {
      const isTerminated = terminated === "true";
      filtered = filtered.filter((user) => user.terminated === isTerminated);
    }

    setFilteredUsers(filtered);
  }, [search, verified, terminated, users]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="w-full">
      <main className="container mx-auto p-4">
        <div className="w-full flex flex-col gap-6">
          <div className="py-5 w-full flex flex-col gap-3 items-start justify-center">
            <h1 className="text-3xl font-medium text-foreground">All Users:</h1>

            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-2 border-white p-2 rounded-md w-72 outline-none"
              />

              <select
                value={verified}
                onChange={(e) => setVerified(e.target.value)}
                className="border-2 border-white p-2 rounded-md"
              >
                <option value="all">Verified Status</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>

              <select
                value={terminated}
                onChange={(e) => setTerminated(e.target.value)}
                className="border-2 border-white p-2 rounded-md"
              >
                <option value="all">Terminated Status</option>
                <option value="true">Terminated</option>
                <option value="false">Not Terminated</option>
              </select>
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <ul className="flex flex-wrap">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="m-5 border-2 rounded border-white p-5 hover:bg-blue-500"
                >
                  <Link href={`/users/${user.id}`}>
                    <p>
                      <strong className="text-lg">ID:</strong> {user.id}
                    </p>
                    <p>
                      <strong className="text-lg">Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong className="text-lg">Email:</strong> {user.email}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-5xl">No users found.</p>
          )}
        </div>
      </main>
    </section>
  );
};

export default UsersPage;
