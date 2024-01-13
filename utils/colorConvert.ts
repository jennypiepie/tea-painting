export const rgba2arr = (rgba: string) => {
    const arr = rgba.replace(/^rgba?\(|\s+|\)$/g, '').split(',').map(Number);
    arr[3] = Math.round(arr[3] * 255 * 100) / 100;
    return arr;
}

export const hex2rgba = (hex: string) => {
    if (hex[0] === "#") hex = hex.slice(1);
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgb(${r},${g},${b},1)`;
}