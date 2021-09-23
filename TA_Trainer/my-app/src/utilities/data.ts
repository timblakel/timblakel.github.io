
/**
 * Grab a random element from a list
 * @param items Any kind of list
 * @returns Random item from list
 */
export function getRandomElement<T>(items: T[]): T {
    return items[Math.floor(Math.random()*items.length)];
}
