import Notice from "./Notice";

type PaginationNoticeProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function PaginationNotice({ children, className }: PaginationNoticeProps) {
    return (
        <Notice className={
            className
                ? className
                : `text-center bg-green-900/40 border border-green-700/60 px-4 py-2 rounded-md min-w-[100px]`
        }>
            {children}
        </Notice>
    )
}