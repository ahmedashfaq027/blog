export const generateIdFromTitle = (title: string) => {
    return `${title.split(" ").join("-").substring(0, 50)}-${Math.floor(100000 + Math.random() * 900000)}`;
}