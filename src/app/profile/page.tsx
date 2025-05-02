"use client";
import { useSessionUser } from "@/hooks/useSessionUser";
import { use, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { redirect, useSearchParams } from "next/navigation";
import { Badge, List, User } from "@/types/User";
import ListComponent from "@/components/List";

enum BadgeColor {
    Red = "bg-red-100 text-red-800",
    Orange = "bg-orange-100 text-orange-800",
    Amber = "bg-amber-100 text-amber-800",
    Yellow = "bg-yellow-100 text-yellow-800",
    Lime = "bg-lime-100 text-lime-800",
    Green = "bg-green-100 text-green-800",
    Emerald = "bg-emerald-100 text-emerald-800",
    Teal = "bg-teal-100 text-teal-800",
    Cyan = "bg-cyan-100 text-cyan-800",
    Sky = "bg-sky-100 text-sky-800",
    Blue = "bg-blue-100 text-blue-800",
    Indigo = "bg-indigo-100 text-indigo-800",
    Violet = "bg-violet-100 text-violet-800",
    Purple = "bg-purple-100 text-purple-800",
    Fuchsia = "bg-fuchsia-100 text-fuchsia-800",
    Pink = "bg-pink-100 text-pink-800",
    Rose = "bg-rose-100 text-rose-800",
    Slate = "bg-slate-100 text-slate-800",
    Gray = "bg-gray-100 text-gray-800",
    Zinc = "bg-zinc-100 text-zinc-800",
    Neutral = "bg-neutral-100 text-neutral-800",
    Stone = "bg-stone-100 text-stone-800",
    White = "bg-white text-gray-800",
    Black = "bg-black text-white",
}

function badgeColorFromString(color: string): BadgeColor {
    switch (color.toLowerCase()) {
        case "red":
            return BadgeColor.Red;
        case "orange":
            return BadgeColor.Orange;
        case "amber":
            return BadgeColor.Amber;
        case "yellow":
            return BadgeColor.Yellow;
        case "lime":
            return BadgeColor.Lime;
        case "green":
            return BadgeColor.Green;
        case "emerald":
            return BadgeColor.Emerald;
        case "teal":
            return BadgeColor.Teal;
        case "cyan":
            return BadgeColor.Cyan;
        case "sky":
            return BadgeColor.Sky;
        case "blue":
            return BadgeColor.Blue;
        case "indigo":
            return BadgeColor.Indigo;
        case "violet":
            return BadgeColor.Violet;
        case "purple":
            return BadgeColor.Purple;
        case "fuchsia":
            return BadgeColor.Fuchsia;
        case "pink":
            return BadgeColor.Pink;
        case "rose":
            return BadgeColor.Rose;
        case "slate":
            return BadgeColor.Slate;
        case "gray":
            return BadgeColor.Gray;
        case "zinc":
            return BadgeColor.Zinc;
        case "neutral":
            return BadgeColor.Neutral;
        case "stone":
            return BadgeColor.Stone;
        case "white":
            return BadgeColor.White;
        case "black":
            return BadgeColor.Black;
        default:
            return BadgeColor.Blue; // Default to gray if no match
    }
}

function Separator() {
    return <hr className="border border-gray-200 my-4 rounded" />
}

function BadgeComponent({ text, color = BadgeColor.Blue, className }: { text: string, color?: BadgeColor, className?: string }) {
    return (
        <span className={`inline-block ${color} text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 mb-2 ${className}`}>
            {text}
        </span>
    )
}

function Lists({ user, possessive }: { user: User, possessive: string }) {
    return (
        <div className="md:w-3/4 w-full bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">{possessive} Lists</h2>
            { user.createdLists.length === 0 ? (
                <p className="text-gray-600">No lists created yet.</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
                    {user.createdLists.map((list: List) => (
                        <ListComponent key={list.id} list={list} author={user} response={list.responses[0]} />
                    ))}
                </div>
            )}
        </div>
    )
}

function UserBadges({ user }: { user: User }) {
    // The administrator and moderator badges are calculated from the role of the user
    // Other badges will (in the future) be stored in the database and be available on the APIUser type
    const badges: { text: string, color: BadgeColor }[] = [];
    if (user.name === "bendevnull") badges.push({ text: "Creator", color: BadgeColor.Purple });
    switch (user.role) {
        case "ADMIN":
            badges.push({ text: "Administrator", color: BadgeColor.Red });
            break;
        case "MODERATOR":
            badges.push({ text: "Moderator", color: BadgeColor.Amber });
            break;
    }

    // Add badges based on user properties
    if (user.createdListCount > 20) badges.push({ text: "Top List Creator", color: BadgeColor.Green });
    if (user.responseCount > 20) badges.push({ text: "Top Responder", color: BadgeColor.Orange });

    // Add custom badges from user.badges
    if (user.badges) {
        user.badges.forEach((badge: Badge) => {
            badges.push({ text: badge.content, color: badgeColorFromString(badge.color) });
        });
    }
    
    return (
        <div className="flex flex-wrap">
            {badges.map((badge, index) => (
                <BadgeComponent key={index} text={badge.text} color={badge.color} className={index > 0 ? "ml-1 lg:visible md:invisible sm:visible" : undefined} />
            ))}
        </div>
    );
}

function UserInfo({ user }: { user: User }) {
    return (
        <div className="md:w-1/4 w-full bg-white p-4 rounded shadow-md">
            <img src={`${user.image}?size=1024`} alt="Profile" className="rounded-4xl border-3 border-gray-200 mb-4" />
            <p className="mb-2 font-bold text-2xl">{user.name}</p>
            <UserBadges user={user} />
            <p className="text-gray-600">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            <Separator />
            <p className="text-gray-600"><strong>Lists Created: </strong>{user.createdListCount}</p>
            <p className="text-gray-600"><strong>Responses: </strong>{user.responseCount}</p>
            <Separator />
            <div className="flex-col items-center gap-2 text-gray-600">
                <p className="text-gray-600"><strong>Followers: </strong>Coming Soon</p>
                <p className="text-gray-600"><strong>Following: </strong>Coming Soon</p>
            </div>
        </div>
    )
}

function Responses({ user, possessive }: { user: User, possessive: string }) {
    return (
        <div className="container mx-auto p-4 flex flex-col gap-4">
            <div className="w-full bg-white p-4 mb-4 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">{possessive} Responses</h2>
                { user.responses.length === 0 ? (
                    <p className="text-gray-600">No responses yet.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
                        {user.responses.map((response: any) => (
                            <ListComponent key={response.id} list={response.list} response={response} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const searchParams = useSearchParams();

    const name = searchParams?.get("name");
    const id = searchParams?.get("id");

    const [user, setUser] = useState<User | null>(null);
    const session = useSessionUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            let response;
            if (id) {
                response = await fetch(`/api/user?id=${id}`);
            } else if (name) {
                response = await fetch(`/api/user?name=${name}`);
            } else if (session?.user?.id) {
                response = await fetch(`/api/user?id=${session.user.id}`);
            } else {
                return;
            }

            if (!response.ok) {
                console.error("Failed to fetch user data");
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log("User data:", data);
            setUser(data);
            setLoading(false);
        }

        fetchUser();
    }, [session?.user]);

    if (loading || session.userLoading) {
        return <LoadingSpinner />;
    }

    if (!user && !session.user) {
        return redirect("/login");
    }

    if (!user) {
        return <p>User not found.</p>;
    }

    function calculatePossessive(user: User, sessionUser: User) {
        if (user.id === sessionUser.id) return "My";
        return user.name + "'s";
    }

    const possessive = calculatePossessive(user, session.user);

    return (
        // two columns on larger screens, single column on mobile
        <div className="flex flex-col flex-grow bg-gray-100">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 mt-4">
                <UserInfo user={user} />
                <Lists user={user} possessive={possessive} />
            </div>
            <Responses user={user} possessive={possessive} />
        </div>
    );
}