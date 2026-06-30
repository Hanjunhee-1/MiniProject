"use client";

import { usePathname, useRouter } from "next/navigation";
import BaseButton from "@/components/button/BaseButton";
import { DashboardUser } from "@/types";

type UserButtonBarProps = {
    users: DashboardUser[];
};

export default function UserButtonBar({ users }: UserButtonBarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isAllActive = pathname === "/";

    return (
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            <BaseButton
                onClick={() => router.push("/")}
                variant={isAllActive ? "active" : "default"}
                size="sm"
                className="shrink-0 text-xs font-bold uppercase"
            >
                전체
            </BaseButton>
            {users.map((user) => {
                const userPath = `/users/${user.id}`;
                const isActive = pathname === userPath;

                return (
                    <BaseButton
                        key={user.id}
                        onClick={() => router.push(userPath)}
                        variant={isActive ? "active" : "default"}
                        size="sm"
                        className="shrink-0 text-xs font-bold uppercase"
                    >
                        {user.name}
                    </BaseButton>
                );
            })}
        </div>
    );
}
