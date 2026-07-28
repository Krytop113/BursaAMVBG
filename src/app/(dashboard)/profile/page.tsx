"use client";

import React, { useState } from "react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  return open ? <EditProfileModal onClose={handleClose} /> : null;
}
