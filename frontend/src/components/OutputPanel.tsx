interface OutputPanelProps {
    output: string;
}

export function OutputPanel({ output }: OutputPanelProps) {
    return (
        <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
            <h2 className="text-lg font-bold mb-2">Output</h2>
            <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                {output || 'Output will appear here...'}
            </pre>
        </div>
    )
}