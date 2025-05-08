"use client"
import { List, Response, User } from '@/types/User';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';

interface ListProps {
    list: List
    author?: User
    className?: string
    headerLink?: boolean
    response: any
    hideHeader?: boolean
    showSettings?: boolean
}

export default function ListComponent({ list, author, className, response, headerLink=true, hideHeader=false, showSettings=false }: ListProps) {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        fetch(`/api/lists/${list.id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    console.log('List deleted successfully');
                    // Optionally, trigger a state update or redirect here
                } else {
                    console.error('Failed to delete the list');
                }
            })
            .catch((error) => {
                console.error('An error occurred while deleting the list:', error);
            });
        redirect("/lists");
    };

    return (
        <div className={`flex justify-center ${className}`}>
            <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 max-w-[480px] w-full">
                {!hideHeader && (
                    <>
                        <h3 className="text-xl font-bold mb-2">
                            {headerLink ? (
                                <a className='hover:underline active:underline' href={`/lists/${list.id}`}>{list.name}</a>
                            ) : (
                                <span>{list.name}</span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-600">
                            by {list.author || author ? (
                                <a className="hover:underline" href={`/profile/${list.author?.name || author?.name}`}>
                                    {list.author?.name || author?.name}
                                </a>
                            ) : "Unknown User"}
                        </p>
                    </>
                )}
                <p className="text-sm text-gray-600 mt-2">
                    {response?.user?.name !== (list.author?.name || author?.name) && (
                        <span>Response by { response?.user?.name ? (
                            <a className="hover:underline" href={`/profile/${response?.user?.name}`}>
                                {response?.user?.name}
                            </a>
                        ) : (
                            "Unknown User"
                        )}   
                        </span>
                    )}
                </p>
                <ul className="divide-y divide-gray-200 mt-4">
                    {JSON.parse(response?.content || "[]").map((item: string, index: number) => (
                        <li key={index} className="flex items-center py-2">
                            <span className="font-bold mr-2">{`${index + 1}.`}</span>
                            <span className="flex-grow text-right">{item}</span>
                        </li>
                    ))}
                </ul>
                {showSettings && (
                    <div className="flex justify-start mt-4 space-x-2">
                        <button 
                            className="px-4 py-2 bg-blue-200 cursor-not-allowed text-white rounded transition-colors"
                            onClick={() => console.log('Edit list', list.id)}
                            disabled
                        >
                            Edit List
                        </button>
                        <button 
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            onClick={() => setDeleteModalOpen(true)}
                        >
                            Delete List
                        </button>
                    </div>
                )}

                {isDeleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="bg-white p-6 rounded shadow-md w-96">
                            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this list? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-4">
                                <button 
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                    onClick={() => setDeleteModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}