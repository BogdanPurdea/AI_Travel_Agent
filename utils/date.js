export default function formatDate(dateStr) {
    const date = new Date(dateStr);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Feb"
    const year = date.getFullYear();

    // Add ordinal suffix (1st, 2nd, 3rd, 4th...)
    const ordinal = (n) => {
        if (n > 3 && n < 21) return 'th'; // Covers 11th to 19th
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${day}${ordinal(day)} ${month} ${year}`;
}