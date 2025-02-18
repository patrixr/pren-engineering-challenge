export function debounce<F extends (...args: any[]) => any>(func: F, wait: number = 500) : F {
    let timeout: any = null

    return function executedFunction(...args: any[]) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    } as F;
}
