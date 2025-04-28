export default function Container({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={`flex flex-col flex-grow justify-center items-center bg-white relative ${className}`}>
            {children}
        </div>
    );
}