import { List, Response, User } from '@/types/User';
import React from 'react';

interface ListProps {
    list: List
    author?: User
    className?: string
    headerLink?: boolean
    response: Response
}

export default function ListComponent({ list, author, className, response, headerLink=true }: ListProps) {
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
                <p className="text-sm text-gray-600">
                    by {list.author || author ? (
                        <a className="hover:underline" href={`/profile?name=${list.author?.name || author?.name}`}>
                            {list.author?.name || author?.name}
                        </a>
                    ) : "Unknown User"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    {response.user?.name !== (list.author?.name || author?.name) && (
                        <span>Response by { response.user?.name ? (
                            <a className="hover:underline" href={`/profile?name=${response.user?.name}`}>
                                {response.user?.name}
                            </a>
                        ) : (
                            "Unknown User"
                        )}   
                        </span>
                    )}
                </p>
                <ul className="divide-y divide-gray-200 mt-4">
                    {JSON.parse(response.content).map((item: string, index: number) => (
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