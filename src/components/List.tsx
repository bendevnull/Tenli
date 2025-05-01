import { List, User } from '@/types/User';
import React from 'react';

interface ListProps {
    list: List
    author?: User
    className?: string
    headerLink?: boolean
}

export default function ListComponent({ list, author, className, headerLink=true }: ListProps) {
    return (
        <div className={`flex justify-center ${className}`}>
            <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 max-w-[480px] w-full">
                <h3 className="text-xl font-bold mb-2">
                    {headerLink ? (
                        <a className='hover:underline active:underline' href={`/lists/${list.id}`}>{list.name}</a>
                    ) : (
                        <span>{list.name}</span>
                    )}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    by {list.author || author ? (
                        <a className="hover:underline" href={`/profile?name=${list.author?.name || author?.name}`}>
                            {list.author?.name || author?.name}
                        </a>
                    ) : "Unknown User"}
                </p>
                <ul className="divide-y divide-gray-200">
                    {JSON.parse(list.responses[0].content).map((item: string, index: number) => (
                        <li key={index} className="flex items-center py-2">
                            <span className="font-bold mr-2">{`${index + 1}.`}</span>
                            <span className="flex-grow text-right">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}