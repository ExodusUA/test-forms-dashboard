interface ErrorMessageProps {
    message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div className="p-3 border border-red-800 rounded-md bg-red-900/50">
            <p className="text-sm text-red-200">{message}</p>
        </div>
    );
}
