import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

interface TagProps extends Omit<ComponentPropsWithoutRef<typeof Link>, 'children'> {
    children: React.ReactNode;
    active?: boolean;
}

const baseStyles =
    'text-xs text-center px-2 py-1 border rounded w-fit ' +
    'hover:bg-[var(--color-tag-hover-bg)] hover:text-[var(--color-tag-hover-text)] hover:border-[var(--color-tag-hover-bg)]';
const inactiveStyles = 'bg-surface text-text-secondary border-border';

const activeInlineStyle: React.CSSProperties = {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 80%, transparent)',
    color: 'var(--color-text-secondary)',
    borderColor: 'var(--color-primary)',
};

export function Tag({
    children,
    active = false,
    className = '',
    ...linkProps
}: TagProps) {
    const stateStyles = active ? '' : inactiveStyles;
    const combinedClassName = [baseStyles, stateStyles, className]
        .filter(Boolean)
        .join(' ');

    return (
        <Link
            className={combinedClassName}
            style={active ? activeInlineStyle : undefined}
            {...linkProps}
        >
            {children}
        </Link>
    );
}
