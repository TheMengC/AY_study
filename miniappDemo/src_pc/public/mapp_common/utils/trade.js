

/**
 * 手机号加-
 * @param mobile
 * @returns {string}
 */
export function mobileSplit (mobile) {
    if (/\d{11}/.test(mobile)) {
        return mobile.substring(0, 3) + '-' + mobile.substring(3, 7) + '-' + mobile.substring(7, 11);
    }
    return mobile;
}
