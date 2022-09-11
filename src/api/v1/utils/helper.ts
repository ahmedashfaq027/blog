export const generateIdFromTitle = (title: string) => {
    return title.split(" ").join("-").substring(0, 50);
}