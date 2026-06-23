type TitleProps = {
    text?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function Title({ text, children, className }: TitleProps) {
    return (
        <div className={className}>
            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-wide">
                    {text}
                </h2>
                {children}
            </div>
        </div>
    );
}