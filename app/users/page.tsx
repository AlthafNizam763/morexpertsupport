"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Plus, Search, MoreHorizontal, MessageSquare, Edit2, Trash2, X, UserPlus, Shield, Mail, User, Lock, Calendar, Phone, Globe, MapPin, FileText, File, UploadCloud, CheckCircle2, LayersPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";


interface UserData {
    id: string;
    name: string;
    email: string;
    password?: string;
    status: "Active" | "Inactive";
    avatar: string;
    // Detail Fields
    package?: string;
    dob?: string;
    gender?: string;
    mobile?: string;
    linkedin?: string;
    address?: string;
}

const INITIAL_USERS: UserData[] = [
    { id: "1", name: "Bondi", email: "bondi@moreexperts.com", status: "Active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky", package: "Premium" },
    { id: "2", name: "David", email: "david@moreexperts.com", status: "Active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", package: "Golden" },
    { id: "3", name: "Lily", email: "lily@moreexperts.com", status: "Active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily", package: "Silver" },
    { id: "4", name: "Sarah", email: "sarah@moreexperts.com", status: "Active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", package: "Premium 2" },
    { id: "5", name: "Mike", email: "mike@moreexperts.com", status: "Active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", package: "Golden 2" },
    { id: "6", name: "Anna", email: "anna@moreexperts.com", status: "Inactive", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna", package: "Silver 2" },
];

const getPackageStyles = (pkg: string) => {
    switch (pkg) {
        case "Silver":
            return "bg-gradient-to-br from-[#C0C0C0] to-[#8E8E8E] text-white border-white/20";
        case "Silver 2":
            return "bg-gradient-to-br from-[#757575] to-[#424242] text-white border-white/10";
        case "Golden":
            return "bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] text-white border-[#F5A623]/50";
        case "Golden 2":
            return "bg-gradient-to-br from-[#F5A623] to-[#D48806] text-black border-black/10 shadow-sm";
        case "Premium":
            return "bg-gradient-to-br from-[#0F0F0B] to-[#1C1C1C] text-white border-[#D4AF37]/50";
        case "Premium 2":
            return "bg-gradient-to-br from-[#2C0A3B] to-[#0F0F0F] text-white border-[#E1BEE7]/50";
        default:
            return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-transparent";
    }
};

const DocumentCard = ({ title, sub, icon: Icon, color, iconColor }: { title: string, sub: string, icon: any, color: string, iconColor: string }) => {
    const [isUploaded, setIsUploaded] = useState(false);

    return (
        <label className="relative flex items-center gap-4 p-4 rounded-3xl bg-secondary-white dark:bg-dark border border-ash/5 hover:border-slate-blue/30 transition-all group cursor-pointer overflow-hidden">
            <input
                type="file"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        setIsUploaded(true);
                        setTimeout(() => setIsUploaded(false), 3000); // Visual feedback
                    }
                }}
            />
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", color)}>
                <Icon className={cn("w-6 h-6", iconColor)} />
            </div>
            <div className="flex-1">
                <h5 className="text-sm font-bold truncate">{title}</h5>
                <p className="text-[10px] font-bold text-ash uppercase tracking-tight">
                    {isUploaded ? "File Selected" : sub}
                </p>
            </div>
            <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm transition-all group-hover:bg-slate-blue group-hover:text-white">
                {isUploaded ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                    <UploadCloud className="w-4 h-4 text-ash group-hover:text-white" />
                )}
            </div>

            {/* Hover Backdrop Overlay */}
            <div className="absolute inset-0 bg-slate-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </label>
    );
};

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", status: "Active" });
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        const auth = localStorage.getItem("more_auth");
        if (auth !== "true") {
            router.push("/");
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) return null;

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const user: UserData = {
            id: Math.random().toString(36).substr(2, 9),
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            status: newUser.status,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`,
        };
        setUsers([user, ...users]);
        setIsModalOpen(false);
        setNewUser({ name: "", email: "", password: "", status: "Active" });
        setNotification({ message: "User added successfully", type: 'success' });
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
        setIsDetailModalOpen(false);
        setNotification({ message: "Profile updated successfully", type: 'success' });
    };

    const handleToggleStatus = (e: React.MouseEvent, userId: string) => {
        e.stopPropagation();
        setUsers(users.map(u =>
            u.id === userId
                ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
                : u
        ));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans flex text-black dark:text-white selection:bg-slate-blue selection:text-white">
            <Sidebar />

            <main className="flex-1 ml-24 p-10 max-w-[1400px] mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-12 flex-1">
                        <h1 className="text-[2.5rem] font-bold tracking-tight">Users</h1>
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ash" />
                            <input
                                type="text"
                                placeholder="Search users"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-secondary-white dark:bg-dark rounded-3xl py-4 pl-14 pr-6 text-sm focus:outline-none shadow-sm placeholder:text-ash/50 border border-ash/10"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add New User
                    </button>
                </div>

                {/* Notifications */}
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200]">
                    <AnimatePresence>
                        {notification && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className={cn(
                                    "px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md",
                                    notification.type === 'success' ? "bg-emerald-500/90 border-emerald-400/20 text-white" : "bg-red-500/90 border-red-400/20 text-white"
                                )}
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-bold text-sm tracking-tight">{notification.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="bg-white dark:bg-zinc-950 rounded-[3rem] shadow-sm overflow-hidden border border-black/5 dark:border-white/10 p-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                <th className="px-10 py-8">User Details</th>
                                <th className="px-10 py-8">Package</th>
                                <th className="px-10 py-8">Status</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                            {filteredUsers.map((user) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={user.id}
                                    className="hover:bg-ash/5 dark:hover:bg-ash/10 transition-colors group border-b border-ash/5 last:border-0"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <img src={user.avatar} className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base">{user.name}</h4>
                                                <p className="text-xs text-zinc-400 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center">
                                            {user.package ? (
                                                <span className={cn(
                                                    "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    getPackageStyles(user.package)
                                                )}>
                                                    {user.package}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 italic">No Package</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => handleToggleStatus(e, user.id)}
                                                className={cn(
                                                    "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none",
                                                    user.status === 'Active' ? "bg-emerald-500/20" : "bg-zinc-200 dark:bg-zinc-800"
                                                )}
                                            >
                                                <motion.div
                                                    animate={{ x: user.status === 'Active' ? 26 : 4 }}
                                                    initial={false}
                                                    className={cn(
                                                        "absolute top-1 w-4 h-4 rounded-full transition-colors",
                                                        user.status === 'Active' ? "bg-emerald-500" : "bg-zinc-400"
                                                    )}
                                                />
                                            </button>
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                user.status === 'Active' ? "text-emerald-500" : "text-zinc-400"
                                            )}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                                <MessageSquare className="w-4 h-4 text-zinc-400" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedUser(user);
                                                    setIsDetailModalOpen(true);
                                                }}
                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                            >
                                                <LayersPlus className="w-4 h-4 text-zinc-400" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Add User Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold">Add Main App User</h2>
                                    <p className="text-[10px] text-ash font-bold uppercase tracking-widest mt-1">Credentials for MoRe Experts App</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-ash uppercase tracking-widest pl-1">Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-ash uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-ash uppercase tracking-widest pl-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <input
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>


                                <button type="submit" className="w-full bg-slate-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl mt-4 shadow-slate-blue/20">
                                    <Plus className="w-5 h-5" />
                                    Confirm and Add User
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* User Details Modal */}
            <AnimatePresence>
                {isDetailModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDetailModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-6">
                                    <img src={selectedUser.avatar} className="w-20 h-20 rounded-[1.75rem] bg-zinc-100 dark:bg-zinc-800" />
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                                        <p className="text-xs text-ash font-bold uppercase tracking-widest mt-1">Profile Details</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateUser} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-ash uppercase tracking-[0.2em] ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <input
                                            type="text"
                                            value={selectedUser.name || ""}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-ash uppercase tracking-[0.2em] ml-1">Package</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <select
                                            value={selectedUser.package || ""}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, package: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-bold appearance-none"
                                        >
                                            <option value="">None</option>
                                            <optgroup label="Silver" className="bg-white dark:bg-zinc-900">
                                                <option value="Silver">Silver 1</option>
                                                <option value="Silver 2">Silver 2</option>
                                            </optgroup>
                                            <optgroup label="Golden" className="bg-white dark:bg-zinc-900">
                                                <option value="Golden">Golden 1</option>
                                                <option value="Golden 2">Golden 2</option>
                                            </optgroup>
                                            <optgroup label="Premium" className="bg-white dark:bg-zinc-900">
                                                <option value="Premium">Premium 1</option>
                                                <option value="Premium 2">Premium 2</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-ash uppercase tracking-[0.2em] ml-1">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <input
                                            type="date"
                                            value={selectedUser.dob || ""}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, dob: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-ash uppercase tracking-[0.2em] ml-1">Gender</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <select
                                            value={selectedUser.gender || ""}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-bold appearance-none"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-ash uppercase tracking-[0.2em] ml-1">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <input
                                            type="tel"
                                            placeholder="+1 234 567 890"
                                            value={selectedUser.mobile || ""}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, mobile: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-ash uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <input
                                            required
                                            type="email"
                                            value={selectedUser.email || ""}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-ash uppercase tracking-[0.2em] ml-1">LinkedIn Profile Link</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                                        <input
                                            type="url"
                                            placeholder="https://linkedin.com/in/username"
                                            value={selectedUser.linkedin || ""}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, linkedin: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-ash uppercase tracking-[0.2em] ml-1">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-14 w-4 h-4 text-ash" />
                                        <textarea
                                            value={selectedUser.address || ""}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                                            className="w-full bg-secondary-white dark:bg-dark border border-ash/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-sm font-bold min-h-[100px] resize-none"
                                            placeholder="Enter full address..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2 pt-6 border-t border-ash/5">
                                    <h3 className="text-xs font-black text-ash uppercase tracking-[0.2em] ml-1">Documents</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DocumentCard
                                            title="Service Guide"
                                            sub="Click to upload PDF"
                                            icon={FileText}
                                            color="bg-red-50 dark:bg-red-900/20"
                                            iconColor="text-red-500"
                                        />

                                        {selectedUser.package !== "Silver" && (
                                            <DocumentCard
                                                title="Contract"
                                                sub="Click to upload DOCX"
                                                icon={File}
                                                color="bg-blue-50 dark:bg-blue-900/20"
                                                iconColor="text-blue-500"
                                            />
                                        )}

                                        {selectedUser.package !== "Silver" && selectedUser.package !== "Silver 2" && (
                                            <DocumentCard
                                                title="Cover Letter"
                                                sub="Click to upload PDF"
                                                icon={Shield}
                                                color="bg-orange-50 dark:bg-orange-900/20"
                                                iconColor="text-orange-500"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <button type="submit" className="w-full bg-slate-blue text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-slate-blue/20">
                                        Update Profile Details
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

