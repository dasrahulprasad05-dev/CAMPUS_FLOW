"use client";

import { useEffect, useState } from "react";
import PusherClient from "pusher-js";
import { toast } from "sonner";
import { Bell } from "lucide-react";

interface RealtimeNoticesProps {
  role: string;
}

export function RealtimeNotices({ role }: RealtimeNoticesProps) {
  const [pusher, setPusher] = useState<PusherClient | null>(null);

  useEffect(() => {
    // Make sure we have the key before trying to connect
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.warn("Pusher environment variables not set. Realtime notices disabled.");
      return;
    }

    const pusherInstance = new PusherClient(pusherKey, {
      cluster: pusherCluster,
    });

    setPusher(pusherInstance);

    // Subscribe to a channel specific to the user's role
    // and also a global channel for all users
    const roleChannel = pusherInstance.subscribe(`notices-${role}`);
    const globalChannel = pusherInstance.subscribe("notices-global");

    const handleNewNotice = (notice: { title: string; category?: string; priority?: string }) => {
      toast.info(`New Notice: ${notice.title}`, {
        description: notice.category ? `Category: ${notice.category}` : "You have a new notice.",
        icon: <Bell className="size-4" />,
      });
    };

    roleChannel.bind("new-notice", handleNewNotice);
    globalChannel.bind("new-notice", handleNewNotice);

    return () => {
      roleChannel.unbind("new-notice", handleNewNotice);
      globalChannel.unbind("new-notice", handleNewNotice);
      pusherInstance.unsubscribe(`notices-${role}`);
      pusherInstance.unsubscribe("notices-global");
      pusherInstance.disconnect();
    };
  }, [role]);

  return null;
}
