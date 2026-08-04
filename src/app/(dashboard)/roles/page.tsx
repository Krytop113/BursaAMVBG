"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RolePageHeader,
  RoleTable,
  AddRoleModal,
  DeleteRoleModal,
} from "@/components/roles";
import type { Role } from "@/types";


export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/roles");

      if (!res.ok) {
        throw new Error("Gagal mengambil data role");
      }

      const data = await res.json();
      setRoles(data.roles ?? []);
    } catch (err) {
      console.error("Gagal mengambil data role:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="space-y-6">
        <RolePageHeader onAddClick={() => setShowAddModal(true)} />

        <RoleTable
          roles={roles}
          isLoading={isLoading}
          onDeleteClick={setDeleteTarget}
        />
      </div>

      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onSuccess={async () => {
            await fetchData();
            setShowAddModal(false);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteRoleModal
          role={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={async () => {
            await fetchData();
            setDeleteTarget(null);
          }}
        />
      )}
    </>
  );
}
