const _window = {
    console: console,
    get location () {

    },
};
export const getWindow = () => {
    if (window) {
        return window;
    } else{
        return _window;
    }
};