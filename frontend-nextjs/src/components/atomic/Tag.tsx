import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

interface TagProps extends Omit<ComponentPropsWithoutRef<typeof Link>, 'children'> {
    children: React.ReactNode;
    /** 是否為選中狀態 */
    active?: boolean;
}

const baseStyles =
    'text-xs text-center px-2 py-1 border rounded w-fit' +
    'border-border bg-surface text-text-secondary hover:bg-[var(--color-tag-hover-bg)] hover:text-[var(--color-tag-hover-text)] hover:border-[var(--color-tag-hover-bg)]';
const activeStyles = 'bg-primary text-surface border-primary';

export function Tag({
    children,
    active = false,
    className = '',
    ...linkProps
}: TagProps) {
    const combinedClassName = [baseStyles, active ? activeStyles : '', className]
        .filter(Boolean)
        .join(' ');

    return (
        <Link className={combinedClassName} {...linkProps}>
            {children}
        </Link>
    );
}
