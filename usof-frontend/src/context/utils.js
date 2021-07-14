import React from "react";

export const catColors = [
    "#cc2714",
    "#cc5b14",
    "#cc9214",
    "#0f9962",
    "#143fcc"];

export const catColorsLight = [
    "#ff8a80",
    "#ffb080",
    "#ffd780",
    "#66cca3",
    "#809dff"];

export const appUrl = "https://murmuring-bayou-41768.herokuapp.com" // process.env.APP_URL
export const apiUrl = appUrl + "/api";
export const storageUrl = appUrl + "/storage";
export const emailRegexp = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/g;
export const passRegexp = /^.{8,}$/g;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getDateString(str, squeeze=false) {
    const date = new Date(str);
    if (squeeze)
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${date.toLocaleTimeString()}`;
}

export function getRatingClass(likes) {
    if (likes > 10)
        return "ratingGold";
    else if (likes > 0)
        return "ratingGreen";
    else if (likes === 0)
        return "ratingGrey";
    return "ratingRed";
}

export function getRatingText(likes) {
    if (likes >= 0)
        return `${likes} Likes`;
    return `${-likes} Dislikes`;
}

export function useViewport() {
    const [width, setWidth] = React.useState(window.innerWidth);
    React.useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
    return width;
}