'use client';

import { useEffect, useState, useRef } from 'react';
import { useArchitect } from './ThemeProvider';
import styles from './ArchitectToolkit.module.scss';

export default function ArchitectToolkit() {
    const { isArchitectMode } = useArchitect();
    const [spec, setSpec] = useState<{
        tag: string;
        classes: string;
        width: number;
        height: number;
        padding?: string;
        display?: string;
        gap?: string;
        fontSize?: string;
        zIndex?: string;
        a11y?: 'PASS' | 'MISSING';
    } | null>(null);
    const [viewport, setViewport] = useState({ w: 0, h: 0, bp: '...' });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [logs, setLogs] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Logger helper
    const addLog = (msg: string) => {
        setLogs(prev => [msg, ...prev].slice(0, 5));
    };

    useEffect(() => {
        if (!isArchitectMode) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            const isToolkit = target?.closest(`.${styles.toolkit}`);
            const isNav = target?.closest('nav');

            if (target && target !== document.body && target !== document.documentElement && !isToolkit && !isNav) {
                const rect = target.getBoundingClientRect();
                const computed = window.getComputedStyle(target);

                const isFlexOrGrid = computed.display.includes('flex') || computed.display.includes('grid');
                const hasGap = computed.gap !== 'normal' && computed.gap !== '0px';

                // A11y Check
                const label = target.getAttribute('aria-label') || target.getAttribute('alt') || target.getAttribute('title') || target.getAttribute('placeholder');
                const hasText = ['BUTTON', 'A'].includes(target.tagName) && target.innerText?.trim().length > 0;
                const hasValue = target.tagName === 'INPUT' && ['button', 'submit'].includes(target.getAttribute('type')?.toLowerCase() || '') && (target as HTMLInputElement).value;
                const hasA11y = label || hasText || hasValue;
                const needsA11y = ['IMG', 'BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SVG'].includes(target.tagName);

                setSpec({
                    tag: target.tagName.toLowerCase(),
                    classes: target.className.toString().split(' ').filter(c => !c.includes('module')).slice(0, 1).join('.'),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    padding: computed.padding !== '0px' ? computed.padding : undefined,
                    display: computed.display,
                    gap: isFlexOrGrid && hasGap ? computed.gap : undefined,
                    fontSize: target.children.length === 0 ? computed.fontSize : undefined,
                    zIndex: computed.zIndex !== 'auto' ? computed.zIndex : undefined,
                    a11y: needsA11y ? (hasA11y ? 'PASS' : 'MISSING') : undefined
                });
            } else {
                setSpec(null);
            }
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            addLog(`[ACTION]: CLICK ON ${target.tagName.toLowerCase()}${target.className ? '.' + target.className.toString().split(' ')[0] : ''}`);
        };

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            let bp = 'XL';
            if (w < 640) bp = 'SM';
            else if (w < 768) bp = 'MD';
            else if (w < 1024) bp = 'LG';
            setViewport({ w, h, bp });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);
        handleResize();
        addLog(`[SYSTEM]: ARCHITECT_MODE_ACTIVE`);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
        };
    }, [isArchitectMode]);

    if (!isArchitectMode) return null;

    return (
        <div className={styles.toolkit} ref={containerRef}>
            {/* Spec Tooltip */}
            {spec && (
                <div
                    className={styles.tooltip}
                    style={{
                        left: mousePos.x + 15,
                        top: mousePos.y + 15
                    }}
                >
                    <div className={styles.specHeader}>
                        <span className={styles.tag}>{spec.tag}</span>
                        {spec.classes && <span className={styles.classes}>.{spec.classes}</span>}
                    </div>
                    <div className={styles.specBody}>
                        <div className={styles.specRow}>
                            <span>DIM:</span>
                            <span>{spec.width} x {spec.height}</span>
                        </div>
                        {spec.display && (
                            <div className={styles.specRow}>
                                <span>DSP:</span>
                                <span>{spec.display}</span>
                            </div>
                        )}
                        {spec.gap && (
                            <div className={styles.specRow}>
                                <span>GAP:</span>
                                <span>{spec.gap}</span>
                            </div>
                        )}
                        {spec.padding && (
                            <div className={styles.specRow}>
                                <span>PAD:</span>
                                <span>{spec.padding}</span>
                            </div>
                        )}
                        {spec.fontSize && (
                            <div className={styles.specRow}>
                                <span>FNT:</span>
                                <span>{spec.fontSize}</span>
                            </div>
                        )}
                        {spec.zIndex && (
                            <div className={styles.specRow}>
                                <span>Z-INX:</span>
                                <span>{spec.zIndex}</span>
                            </div>
                        )}
                        {spec.a11y && (
                            <div className={`${styles.specRow} ${styles.a11yRow}`}>
                                <span>A11Y:</span>
                                <span className={spec.a11y === 'PASS' ? styles.a11yPass : styles.a11yMissing}>
                                    {spec.a11y}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Viewport Metadata */}
            <div className={styles.viewport}>
                <span className={styles.bp}>{viewport.bp}</span>
                <span className={styles.res}>{viewport.w} x {viewport.h}</span>
            </div>

            {/* Interaction Logger */}
            <div className={styles.logger}>
                <div className={styles.loggerHeader}>UI_INTERACTION_LOG</div>
                <div className={styles.logs}>
                    {logs.map((log, i) => (
                        <div key={i} className={styles.logLine}>{log}</div>
                    ))}
                </div>
            </div>

            {/* Grid Overlay Toggle (Visual only via globals.scss usually, but we could add more here) */}
        </div>
    );
}
