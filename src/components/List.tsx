import { APIUser } from '@/app/api/user/route';
import { List, User } from '@/types/User';
import React from 'react';

interface ListProps {
    list: List
    author?: APIUser
}

export default function ListComponent({ list, author }: ListProps) {
    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-xl font-bold mb-2 hover:underline"><a href={`/list/${list.id}`}>{list.name}</a></h3>
            <p className="text-sm text-gray-600 mb-4">by {list.author || author ? <a className='hover:underline' href={`/profile?name=${list.author?.name || author?.name}`}>{list.author?.name || author?.name}</a> : "Unknown User"}</p>
            <ul className="divide-y divide-gray-200">
                {JSON.parse(list.responses[0].content).map((item: string, index: number) => (
                    <li key={index} className="flex items-center py-2">
                        <span className="font-bold mr-2">{`${index + 1}.`}</span>
                        <span className="flex-grow text-right">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}