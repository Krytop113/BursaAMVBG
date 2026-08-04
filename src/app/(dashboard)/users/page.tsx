"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  UserPageHeader,
  UserFilters,
  UserTable,
  AddUserModal,
  EditUserModal,
  DeleteUserModal,
} from "@/components/users";
import type { User, Role } from "@/types";


export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRole, setSelectedRole] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [userRes, roleRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/roles"),
      ]);

      const [userData, roleData] = await Promise.all([
        userRes.json(),
        roleRes.json(),
      ]);

      if (userRes.ok) {
        setUsers(userData.users ?? []);
      }

      if (roleRes.ok) {
        setRoles(roleData.roles ?? []);
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredUsers = users.filter((user) => {
    const matchesRole =
      selectedRole === "Semua" || user.role === selectedRole;

    const keyword = searchQuery.toLowerCase();

    const matchesSearch =
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      String(user.id).includes(keyword);

    return matchesRole && matchesSearch;
  });

  const handleResetFilter = () => {
    setSelectedRole("Semua");
    setSearchQuery("");
  };

  return (
    <>
      <div className="space-y-6">
        <UserPageHeader onAddClick={() => setShowAddModal(true)} />

        <UserFilters
          roles={roles}
          searchQuery={searchQuery}
          selectedRole={selectedRole}
          onSearchChange={setSearchQuery}
          onRoleChange={setSelectedRole}
        />

        <UserTable
          users={users}
          filteredUsers={filteredUsers}
          isLoading={isLoading}
          searchQuery={searchQuery}
          selectedRole={selectedRole}
          onResetFilter={handleResetFilter}
          onEditClick={setEditTarget}
          onDeleteClick={setDeleteTarget}
        />
      </div>

      {showAddModal && (
        <AddUserModal
          roles={roles}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}

      {editTarget && (
        <EditUserModal
          user={editTarget}
          roles={roles}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchData}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchData}
        />
      )}
    </>
  );
}

